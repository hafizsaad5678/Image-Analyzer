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
      <header className="sticky top-0 z-40 border-b border-border/30" style={{ background: 'rgba(26, 18, 37, 0.8)', backdropFilter: 'blur(24px) saturate(1.4)', WebkitBackdropFilter: 'blur(24px) saturate(1.4)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl shadow-[0_0_20px_rgba(142,101,171,0.5)] transition-transform hover:scale-105"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <ScanSearch className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight" style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ScreenSense AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">How it Works</a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-4">
            <a
              href="https://hafizsaad.netlify.app/"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Portfolio
            </a>
            <a href="#upload" className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 hover:shadow-[0_0_15px_rgba(211,186,131,0.4)]">
              Try Now
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
        {/* Hero */}
        <section className="relative pt-24 pb-20 text-center lg:pt-32 lg:pb-28 overflow-hidden">
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
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <a href="#upload" className="inline-flex h-12 items-center justify-center rounded-full px-8 text-base font-medium shadow-[0_0_30px_rgba(211,186,131,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(211,186,131,0.5)]" style={{ background: 'var(--gradient-primary)', color: '#1a1225' }}>
              Start Analyzing <Zap className="ml-2 h-4 w-4" />
            </a>
            <a href="#how-it-works" className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-background/50 px-8 text-base font-medium backdrop-blur-sm transition-colors hover:bg-muted hover:text-foreground">
              View Examples
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

      <footer className="border-t border-border/40 mt-20" style={{ background: 'rgba(26, 18, 37, 0.4)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'var(--gradient-primary)' }}>
                  <ScanSearch className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-lg" style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ScreenSense AI</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">
                Empowering developers and designers with intelligent screenshot analysis, instant code generation, and UI critiques.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Use Cases</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Changelog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Hafiz Saad. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Status:</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span> All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
