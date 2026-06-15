import { Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HistoryItem } from "@/lib/history";

interface Props {
  items: HistoryItem[];
  onOpen: (item: HistoryItem) => void;
  onClear: () => void;
}

export function HistoryPanel({ items, onOpen, onClear }: Props) {
  if (!items.length) return null;
  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" style={{ color: '#d3ba83' }} />
          <h2 className="text-xl font-semibold">Recent Analyses</h2>
          <span className="text-sm text-muted-foreground">({items.length})</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClear} className="gap-2">
          <Trash2 className="h-4 w-4" /> Clear
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onOpen(item)}
            className="group text-left rounded-xl overflow-hidden hover:scale-[1.02] transition-all duration-300"
            style={{
              background: 'rgba(142, 101, 171, 0.08)',
              backdropFilter: 'blur(16px) saturate(1.3)',
              WebkitBackdropFilter: 'blur(16px) saturate(1.3)',
              border: '1px solid rgba(142, 101, 171, 0.18)',
              boxShadow: '0 4px 20px rgba(26, 18, 37, 0.3)',
            }}
          >
            <div className="aspect-video bg-background/40 overflow-hidden">
              <img
                src={item.thumbnail}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="p-3">
              <p className="text-sm font-medium truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {item.result.summary}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
