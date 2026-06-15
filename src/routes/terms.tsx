import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20 animate-fade-in-up">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">Terms of Service</h1>
      
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>
          Welcome to ScreenSense AI. By using our services, you agree to comply with and be bound by the following terms of use.
        </p>
        
        <h2 className="text-xl font-bold text-foreground mt-8">1. Acceptance of Terms</h2>
        <p>
          By accessing or using the ScreenSense AI interface, you represent that you have read and understood these Terms of Service. If you do not agree, please do not use the application.
        </p>
        
        <h2 className="text-xl font-bold text-foreground mt-8">2. Use of Service</h2>
        <p>
          You agree to use ScreenSense AI solely for lawful purposes. You must not upload any content that:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Infringes on the intellectual property of others.</li>
          <li>Contains malware, viruses, or any other destructive software payload.</li>
          <li>Contains illegal, graphic, or harmful visual material.</li>
        </ul>
        
        <h2 className="text-xl font-bold text-foreground mt-8">3. Disclaimer of Warranties</h2>
        <p>
          ScreenSense AI is provided "as is" and "as available". We make no warranties of any kind regarding the accuracy, completeness, or reliability of the AI-generated analysis outputs.
        </p>
      </div>
    </div>
  );
}
