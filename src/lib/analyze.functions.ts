import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SYSTEM_PROMPT = `You are an expert AI Screenshot Analyst. Analyze screenshots, images, dashboards, code screenshots, websites, applications, and user interfaces. Explain what is visible in simple professional language. Extract important text. Identify possible issues if present. Provide actionable recommendations. Also provide smart contextual suggestions — these are creative, insightful tips based on what you understand from the image (e.g., design improvements, UX enhancements, accessibility tips, performance optimizations, best practices, or related tools/resources). Never hallucinate information that is not visible in the image.

Respond ONLY with valid JSON matching exactly:
{
  "summary": "string - 1-2 sentence overview of what's shown",
  "extractedText": "string - all readable text from the image, preserving structure with newlines. Empty string if no text.",
  "contextUnderstanding": "string - 2-4 sentences explaining purpose, screen type, and what's happening",
  "issuesDetected": ["array of strings - each a specific issue, error, warning, or empty array"],
  "recommendations": ["array of strings - each an actionable next step"],
  "suggestions": ["array of strings - each a smart contextual suggestion: design tips, accessibility advice, UX improvements, best practices, or related tools/resources based on what's shown in the image"]
}`;

// Naive in-memory rate limit (per server instance). 20 req / minute / IP.
const buckets = new Map<string, { count: number; reset: number }>();
function rateLimit(ip: string) {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now > b.reset) {
    buckets.set(ip, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (b.count >= 20) return false;
  b.count++;
  return true;
}

const ALLOWED_MIME = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

const inputSchema = z.object({
  imageDataUrl: z
    .string()
    .min(50)
    .max(15_000_000) // ~10MB base64
    .refine((s) => s.startsWith("data:image/"), "Must be image data URL"),
});

export type AnalysisResult = {
  summary: string;
  extractedText: string;
  contextUnderstanding: string;
  issuesDetected: string[];
  recommendations: string[];
  suggestions: string[];
};

export const analyzeScreenshot = createServerFn({ method: "POST" })
  .inputValidator(inputSchema)
  .handler(async ({ data }): Promise<AnalysisResult> => {
    const apiKey =
      process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "AI service not configured. Add GEMINI_API_KEY to your .env file.",
      );
    }

    // Validate mime
    const mimeMatch = data.imageDataUrl.match(/^data:([^;]+);base64,/);
    if (!mimeMatch || !ALLOWED_MIME.includes(mimeMatch[1].toLowerCase())) {
      throw new Error("Unsupported image type. Use PNG, JPG, or WEBP.");
    }

    const mimeType = mimeMatch[1].toLowerCase();
    // Extract only the base64 data (strip the data URL prefix)
    const base64Data = data.imageDataUrl.replace(/^data:[^;]+;base64,/, "");

    // Rate limit (best-effort)
    rateLimit("global");

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                text: "Analyze this screenshot and respond with the JSON structure.",
              },
              {
                inlineData: {
                  mimeType,
                  data: base64Data,
                },
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    });

    if (res.status === 401 || res.status === 403) {
      throw new Error(
        "Invalid or unauthorized Gemini API key. Get a valid key from https://aistudio.google.com/apikey",
      );
    }
    if (res.status === 429) throw new Error("Rate limit reached. Please try again shortly.");
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`AI request failed (${res.status}): ${text.slice(0, 200)}`);
    }

    const payload = await res.json();
    const content: string =
      payload?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

    let parsed: AnalysisResult;
    try {
      parsed = JSON.parse(content);
    } catch {
      // Try to extract JSON object substring
      const m = content.match(/\{[\s\S]*\}/);
      if (!m) throw new Error("AI returned malformed response");
      parsed = JSON.parse(m[0]);
    }

    return {
      summary: String(parsed.summary ?? ""),
      extractedText: String(parsed.extractedText ?? ""),
      contextUnderstanding: String(parsed.contextUnderstanding ?? ""),
      issuesDetected: Array.isArray(parsed.issuesDetected) ? parsed.issuesDetected.map(String) : [],
      recommendations: Array.isArray(parsed.recommendations)
        ? parsed.recommendations.map(String)
        : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.map(String) : [],
    };
  });
