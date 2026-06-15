import type { AnalysisResult } from "./analyze.functions";

export interface HistoryItem {
  id: string;
  name: string;
  thumbnail: string; // small data URL
  imageDataUrl: string;
  result: AnalysisResult;
  createdAt: number;
}

const KEY = "ai-screenshot-history-v1";
const MAX = 10;

export function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveHistory(items: HistoryItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX)));
  } catch {
    // quota — drop oldest until fits
    let trimmed = items.slice(0, MAX);
    while (trimmed.length > 1) {
      try {
        localStorage.setItem(KEY, JSON.stringify(trimmed));
        return;
      } catch {
        trimmed = trimmed.slice(0, trimmed.length - 1);
      }
    }
  }
}

export async function makeThumbnail(dataUrl: string, max = 240): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(dataUrl);
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
