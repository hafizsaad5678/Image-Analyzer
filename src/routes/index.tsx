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

      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
        {/* Hero */}
        <section className="relative pt-10 pb-20 text-center lg:pt-12 lg:pb-28 overflow-hidden">
          {/* Background glow effects */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none -z-10" />
          
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium mb-8 transition-transform hover:scale-105 cursor-default" style={{ background: 'rgba(142, 101, 171, 0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(142, 101, 171, 0.3)', boxShadow: '0 0 20px rgba(142, 101, 171, 0.2)' }}>
              <Sparkles className="h-4 w-4 animate-pulse" style={{ color: '#d3ba83' }} />
              <span className="text-foreground/90">Powered by Gemini 2.5 Flash Intelligence</span>
            </div>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter mb-6 leading-tight max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Decode any{" "}
            <span
              className="bg-clip-text text-transparent relative inline-block"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              interface
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50 rounded-full"></span>
            </span>{" "}
            instantly
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Upload a screenshot of any UI, code snippet, or complex dashboard. ScreenSense AI instantly extracts text, analyzes visual hierarchy, and provides actionable insights.
          </p>
          
          <div className="mt-10 flex justify-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <a href="#upload" className="inline-flex h-12 items-center justify-center rounded-full px-8 text-base font-medium shadow-[0_0_30px_rgba(211,186,131,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(211,186,131,0.5)]" style={{ background: 'var(--gradient-primary)', color: '#1a1225' }}>
              Start Analyzing <Zap className="ml-2 h-4 w-4" />
            </a>
          </div>

          <div className="mt-16 flex flex-wrap gap-8 justify-center text-sm font-medium text-muted-foreground/80 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <span className="flex items-center gap-2 hover:text-foreground transition-colors">
              <div className="p-1.5 rounded-md bg-accent/10"><ShieldCheck className="h-4 w-4 text-accent" /></div> Privacy First
            </span>
            <span className="flex items-center gap-2 hover:text-foreground transition-colors">
              <div className="p-1.5 rounded-md bg-destructive/10"><Zap className="h-4 w-4 text-destructive" /></div> Lightning Fast
            </span>
            <span className="flex items-center gap-2 hover:text-foreground transition-colors">
              <div className="p-1.5 rounded-md bg-ring/10"><ScanSearch className="h-4 w-4 text-ring" /></div> Pixel Perfect
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
    </div>
  );
}
