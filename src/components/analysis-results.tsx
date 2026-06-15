import { Copy, FileText, Lightbulb, AlertTriangle, Eye, Sparkles, Check, MessageSquarePlus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AnalysisResult } from "@/lib/analyze.functions";
import { toast } from "sonner";

interface Props {
  result: AnalysisResult | null;
  loading: boolean;
}

function SectionCard({
  icon: Icon,
  title,
  accent,
  children,
  onCopy,
}: {
  icon: typeof Sparkles;
  title: string;
  accent?: "primary" | "secondary";
  children: React.ReactNode;
  onCopy?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <Card
      className="border bg-card/60 p-6 relative overflow-hidden transition-all duration-300 hover:scale-[1.01]"
      style={{
        background: 'rgba(142, 101, 171, 0.08)',
        backdropFilter: 'blur(20px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
        border: '1px solid rgba(142, 101, 171, 0.18)',
        boxShadow: '0 8px 32px rgba(26, 18, 37, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: accent === "secondary" ? "var(--gradient-maroon)" : "var(--gradient-primary)",
        }}
      />
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{
              background:
                accent === "secondary" ? "var(--gradient-maroon)" : "var(--gradient-primary)",
            }}
          >
            <Icon className="h-4 w-4 text-primary-foreground" />
          </div>
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        {onCopy && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              onCopy();
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            aria-label={`Copy ${title}`}
          >
            {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
          </Button>
        )}
      </div>
      <div className="text-sm text-foreground/90 leading-relaxed">{children}</div>
    </Card>
  );
}

function copy(text: string) {
  navigator.clipboard.writeText(text);
  toast.success("Copied to clipboard");
}

export function AnalysisResults({ result, loading }: Props) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="bg-card/60 p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-5 w-40" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-11/12 mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </Card>
        ))}
      </div>
    );
  }

  if (!result) return null;

  const full = [
    `SUMMARY\n${result.summary}`,
    `\nEXTRACTED TEXT\n${result.extractedText || "(none)"}`,
    `\nCONTEXT\n${result.contextUnderstanding}`,
    `\nISSUES\n${result.issuesDetected.map((i) => `- ${i}`).join("\n") || "(none)"}`,
    `\nRECOMMENDATIONS\n${result.recommendations.map((r) => `- ${r}`).join("\n") || "(none)"}`,
    `\nSUGGESTIONS\n${result.suggestions.map((s) => `- ${s}`).join("\n") || "(none)"}`,
  ].join("\n");

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => copy(full)} className="gap-2">
          <Copy className="h-4 w-4" /> Copy full analysis
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard icon={Sparkles} title="Screenshot Summary" onCopy={() => copy(result.summary)}>
          {result.summary || <span className="text-muted-foreground">No summary.</span>}
        </SectionCard>

        <SectionCard
          icon={Eye}
          title="Context Understanding"
          onCopy={() => copy(result.contextUnderstanding)}
        >
          {result.contextUnderstanding || (
            <span className="text-muted-foreground">No context.</span>
          )}
        </SectionCard>

        <SectionCard
          icon={FileText}
          title="Extracted Text"
          onCopy={() => copy(result.extractedText)}
        >
          {result.extractedText ? (
            <pre className="whitespace-pre-wrap font-mono text-xs bg-background/50 border rounded-md p-3 max-h-64 overflow-auto">
              {result.extractedText}
            </pre>
          ) : (
            <span className="text-muted-foreground">No readable text detected.</span>
          )}
        </SectionCard>

        <SectionCard
          icon={AlertTriangle}
          title="Issues Detected"
          accent="secondary"
          onCopy={() => copy(result.issuesDetected.join("\n"))}
        >
          {result.issuesDetected.length ? (
            <ul className="space-y-2">
              {result.issuesDetected.map((issue, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-accent-foreground/80 mt-1">•</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-muted-foreground">No issues detected.</span>
          )}
        </SectionCard>

        <SectionCard
          icon={Lightbulb}
          title="Recommendations"
          onCopy={() => copy(result.recommendations.join("\n"))}
        >
          {result.recommendations.length ? (
            <ul className="space-y-2">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-primary mt-1">→</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-muted-foreground">No recommendations.</span>
          )}
        </SectionCard>

        <SectionCard
          icon={MessageSquarePlus}
          title="Smart Suggestions"
          onCopy={() => copy(result.suggestions.join("\n"))}
        >
          {result.suggestions.length ? (
            <ul className="space-y-2">
              {result.suggestions.map((suggestion, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-primary mt-1">💡</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-muted-foreground">No suggestions.</span>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
