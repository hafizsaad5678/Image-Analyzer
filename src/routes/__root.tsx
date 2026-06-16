import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { ScanSearch, Linkedin, Github, Briefcase, Globe } from "lucide-react";

import appCss from "../styles.css?url";
import { reportError } from "../lib/error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "InsightLens AI — Understand any screenshot instantly" },
      { name: "description", content: "Upload any screenshot and get AI-powered analysis, text extraction, issue detection, and smart suggestions." },
      { name: "author", content: "Hafiz Saad" },
      { property: "og:title", content: "InsightLens AI" },
      { property: "og:description", content: "Upload any screenshot and get AI-powered analysis, text extraction, issue detection, and smart suggestions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@HafizSaad" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col justify-between">
        {/* Navbar */}
        <header className="sticky top-0 z-40 border-b border-border/30" style={{ background: 'rgba(26, 18, 37, 0.8)', backdropFilter: 'blur(24px) saturate(1.4)', WebkitBackdropFilter: 'blur(24px) saturate(1.4)' }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl shadow-[0_0_20px_rgba(142,101,171,0.5)] transition-transform hover:scale-105"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <ScanSearch className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight hidden sm:block" style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>InsightLens AI</span>
            </Link>
            <nav className="flex items-center gap-4 sm:gap-8">
              <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors [&.active]:text-accent">Home</Link>
              <Link to="/features" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors [&.active]:text-accent">Features</Link>
              <Link to="/how-it-works" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors [&.active]:text-accent">How it Works</Link>
              <Link to="/privacy" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors [&.active]:text-accent">Privacy And Policy</Link>
              <Link to="/terms" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors [&.active]:text-accent">Terms And Conditions</Link>

            </nav>
            <div className="flex items-center gap-3">
              <a
                href="https://hafizsaad.netlify.app/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center justify-center rounded-full border border-border bg-background/40 px-5 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:bg-accent hover:text-accent-foreground hover:border-accent"
              >
                Portfolio
              </a>
              <a
                href="https://www.linkedin.com/in/hafiz-saad-8a3853395/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center justify-center rounded-full border border-border bg-background/40 px-4 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:bg-accent hover:text-accent-foreground hover:border-accent gap-1.5"
              >
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-grow">
          <Outlet />
        </div>

        {/* Footer */}
        <footer className="border-t border-border/40 mt-20" style={{ background: 'rgba(26, 18, 37, 0.4)' }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'var(--gradient-primary)' }}>
                    <ScanSearch className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="font-display font-bold text-lg" style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>InsightLens AI</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  Empowering developers and designers with intelligent screenshot analysis, instant code generation, and UI critiques.
                </p>
                <div className="flex items-center gap-4">
                  <a href="https://www.linkedin.com/in/hafiz-saad-8a3853395/" target="_blank" rel="noreferrer" className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all">
                    <span className="sr-only">LinkedIn</span>
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a href="https://github.com/hafizsaad5678" target="_blank" rel="noreferrer" className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all">
                    <span className="sr-only">GitHub</span>
                    <Github className="h-4 w-4" />
                  </a>
                  <a href="https://www.fiverr.com/saad_dev2" target="_blank" rel="noreferrer" className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all">
                    <span className="sr-only">Fiverr</span>
                    <Briefcase className="h-4 w-4" />
                  </a>
                  <a href="https://hafizsaad.netlify.app/" target="_blank" rel="noreferrer" className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all">
                    <span className="sr-only">Portfolio</span>
                    <Globe className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-4">Product</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><Link to="/features" className="hover:text-accent transition-colors [&.active]:text-accent">Features</Link></li>
                  <li><Link to="/how-it-works" className="hover:text-accent transition-colors [&.active]:text-accent">How it Works</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-4">Contact</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><a href="https://www.fiverr.com/saad_dev2" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">Contact Me (Fiverr)</a></li>
                  <li><a href="https://www.linkedin.com/in/hafiz-saad-8a3853395/" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">LinkedIn</a></li>
                  <li><a href="https://github.com/hafizsaad5678" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">GitHub</a></li>
                  <li><a href="https://hafizsaad.netlify.app/" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">Portfolio</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-4">Legal</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><Link to="/privacy" className="hover:text-accent transition-colors [&.active]:text-accent">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="hover:text-accent transition-colors [&.active]:text-accent">Terms of Service</Link></li>
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
    </QueryClientProvider>
  );
}
