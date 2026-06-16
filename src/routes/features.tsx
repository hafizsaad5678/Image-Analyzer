import { createFileRoute, Link } from "@tanstack/react-router";
import { ScanSearch, Sparkles, Code, Eye, FileText, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/features")({
  component: FeaturesPage,
});

function FeaturesPage() {
  const features = [
    {
      icon: <FileText className="h-6 w-6 text-accent" />,
      title: "Instant OCR & Text Extraction",
      description: "Extract text from any image instantly. Recognizes code snippets, tabular data, error logs, and headings with high accuracy.",
    },
    {
      icon: <Eye className="h-6 w-6 text-secondary" />,
      title: "Visual Hierarchy Analysis",
      description: "Analyze how visual elements are structured. Detect font size hierarchies, alignment mismatches, and element spacing.",
    },
    {
      icon: <Code className="h-6 w-6 text-primary" />,
      title: "UI to Code Ideas",
      description: "Generate structured suggestions on how to build components from screenshots, pointing you to standard design patterns.",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-accent" />,
      title: "Design Critique & Suggestions",
      description: "Get immediate feedback on contrast, spacing, accessibility compliance, and aesthetics to make your UI feel premium.",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-20 animate-fade-in-up">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Core <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>Capabilities</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          InsightLens AI leverages advanced vision intelligence models to decode, transcribe, and analyze any interface you throw at it.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {features.map((feature, i) => (
          <div key={i} className="glass-card p-8 rounded-2xl border border-border/40 hover:border-accent/30 transition-all hover:-translate-y-1">
            <div className="h-12 w-12 rounded-xl bg-background/50 flex items-center justify-center mb-6 border border-border/20 shadow-sm">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="glass-card-strong p-10 rounded-3xl border border-border/50 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Ready to analyze your first screenshot?</h2>
        <p className="text-muted-foreground mb-8">
          Upload any image and experience these features first-hand. No setup, no credit cards, completely free.
        </p>
        <Link to="/" hash="upload" className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-medium text-primary-foreground shadow transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(142,101,171,0.4)]">
          Go to Upload Dashboard <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
