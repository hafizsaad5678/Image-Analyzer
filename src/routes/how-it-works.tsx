import { createFileRoute, Link } from "@tanstack/react-router";
import { Upload, Cpu, FileSpreadsheet, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  component: HowItWorksPage,
});

function HowItWorksPage() {
  const steps = [
    {
      step: "01",
      icon: <Upload className="h-6 w-6 text-accent" />,
      title: "Upload a Screenshot",
      description: "Drag & drop or paste any screenshot. We accept standard image formats (PNG, JPG, WebP) directly from your clipboard or system explorer.",
    },
    {
      step: "02",
      icon: <Cpu className="h-6 w-6 text-secondary" />,
      title: "AI Processing",
      description: "The screenshot is securely uploaded to our server and processed using Gemini's visual model. The AI scans layout structures, text characters, and colors.",
    },
    {
      step: "03",
      icon: <FileSpreadsheet className="h-6 w-6 text-primary" />,
      title: "Instant Insights",
      description: "Receive a structured analysis containing exact OCR text, usability assessments, and color schemes in under 5 seconds.",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-20 animate-fade-in-up">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          How It <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>Works</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Three simple steps to unlock deep visual analysis for any website, application screen, or wireframe.
        </p>
      </div>

      <div className="relative border-l border-border/30 pl-8 ml-4 md:ml-8 space-y-12 mb-16">
        {steps.map((step, i) => (
          <div key={i} className="relative">
            {/* Dot marker */}
            <div className="absolute -left-[53px] top-1.5 h-10 w-10 rounded-full border border-border bg-background flex items-center justify-center font-display font-bold text-accent shadow-sm">
              {step.step}
            </div>

            <div className="glass-card p-8 rounded-2xl border border-border/40 hover:border-primary/30 transition-all max-w-3xl">
              <div className="h-12 w-12 rounded-xl bg-background/50 flex items-center justify-center mb-6 border border-border/20">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card-strong p-10 rounded-3xl border border-border/50 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Experience it in action</h2>
        <p className="text-muted-foreground mb-8">
          Upload a screenshot of this page or any other tab you have open to see how InsightLens AI breaks it down.
        </p>
        <Link to="/" hash="upload" className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-medium text-primary-foreground shadow transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(142,101,171,0.4)]">
          Launch Analyzer <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
