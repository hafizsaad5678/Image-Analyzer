import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { ScanSearch, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { Toaster, toast } from "sonner";

import { analyzeScreenshot, type AnalysisResult } from "@/lib/analyze.functions";
import { ScreenshotUploader } from "@/components/screenshot-uploader";
import { AnalysisResults } from "@/components/analysis-results";
import { HistoryPanel } from "@/components/history-panel";
import { loadHistory, saveHistory, makeThumbnail, type HistoryItem } from "@/lib/history";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Screenshot Explainer — Understand any screenshot instantly" },
      {
        name: "description",
        content:
          "Upload any screenshot and let AI extract text, explain context, surface issues, and suggest next steps. Powered by Gemini Vision.",
      },
      { property: "og:title", content: "AI Screenshot Explainer" },
      {
        property: "og:description",
        content:
          "Upload any screenshot and let AI extract text, explain context, surface issues, and suggest next steps.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const analyze = useServerFn(analyzeScreenshot);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const runAnalysis = async () => {
    if (!imageDataUrl) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await analyze({ data: { imageDataUrl } });
      setResult(res);
      const thumbnail = await makeThumbnail(imageDataUrl);
      const item: HistoryItem = {
        id: crypto.randomUUID(),
        name: imageName ?? "Screenshot",
        thumbnail,
        imageDataUrl,
        result: res,
        createdAt: Date.now(),
      };
      const next = [item, ...history].slice(0, 10);
      setHistory(next);
      saveHistory(next);
      toast.success("Analysis complete");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Analysis failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const openHistory = (item: HistoryItem) => {
    setImageDataUrl(item.imageDataUrl);
    setImageName(item.name);
    setResult(item.result);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearHistory = () => {
    setHistory([]);
    saveHistory([]);
    toast.success("History cleared");
  };

  return (
    <div className="min-h-screen">
      <Toaster theme="dark" position="top-center" richColors />

      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/30" style={{ background: 'rgba(26, 18, 37, 0.6)', backdropFilter: 'blur(24px) saturate(1.4)', WebkitBackdropFilter: 'blur(24px) saturate(1.4)' }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg glow-pulse"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <ScanSearch className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg" style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ScreenSense AI</span>
          </div>
          <a
            href="https://hafizsaad.netlify.app/"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            Portfolio
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
        {/* Hero */}
        <section className="pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-muted-foreground mb-6" style={{ background: 'rgba(142, 101, 171, 0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(142, 101, 171, 0.2)' }}>
            <Sparkles className="h-3.5 w-3.5" style={{ color: '#d3ba83' }} />
            Advanced Vision Intelligence
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
            Decode any{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              interface
            </span>{" "}
            instantly
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload a screenshot of any UI, code, or error log. ScreenSense AI will instantly extract text, diagnose visual issues, and provide actionable design & performance suggestions.
          </p>
          <div className="mt-8 flex flex-wrap gap-6 justify-center text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" style={{ color: '#d3ba83' }} /> Secure server-side
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-4 w-4" style={{ color: '#dc94b0' }} /> Gemini 2.5 Flash
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" style={{ color: '#8e65ab' }} /> No signup
            </span>
          </div>
        </section>

        {/* Upload */}
        <section id="upload">
          <ScreenshotUploader
            imageDataUrl={imageDataUrl}
            imageName={imageName}
            isLoading={loading}
            onImage={(url, name) => {
              setImageDataUrl(url);
              setImageName(name);
              setResult(null);
            }}
            onAnalyze={runAnalysis}
            onClear={() => {
              setImageDataUrl(null);
              setImageName(null);
              setResult(null);
            }}
          />
        </section>

        {/* Results */}
        {(loading || result) && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-5">Analysis</h2>
            <AnalysisResults loading={loading} result={result} />
          </section>
        )}

        {/* History */}
        <HistoryPanel items={history} onOpen={openHistory} onClear={clearHistory} />
      </main>

      <footer className="border-t py-8 text-center text-xs text-muted-foreground" style={{ borderColor: 'rgba(142, 101, 171, 0.15)', background: 'rgba(26, 18, 37, 0.4)' }}>
        © 2026 Hafiz Saad. All rights reserved.
      </footer>
    </div>
  );
}
