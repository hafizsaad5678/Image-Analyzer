import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20 animate-fade-in-up">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">Privacy Policy</h1>
      
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>
          At ScreenSense AI, we prioritize your data privacy. This Privacy Policy details how we handle the images and inputs you submit to our service.
        </p>
        
        <h2 className="text-xl font-bold text-foreground mt-8">1. Uploaded Content</h2>
        <p>
          Any screenshot or image you upload to ScreenSense AI is sent to our servers for processing via secure, encrypted channels (HTTPS). The images are sent to Gemini Vision APIs to analyze their contents and are deleted shortly after processing.
        </p>
        
        <h2 className="text-xl font-bold text-foreground mt-8">2. Data Storage</h2>
        <p>
          We do not store your uploaded screenshots persistently on our servers. All history items are stored locally in your browser's local storage (LocalStorage) and are never synced to external databases without your explicit interaction.
        </p>
        
        <h2 className="text-xl font-bold text-foreground mt-8">3. Cookies & Local Storage</h2>
        <p>
          We use browser LocalStorage to save your recent analysis results so you can refer back to them. No tracking cookies or third-party advertising cookies are configured.
        </p>
      </div>
    </div>
  );
}
