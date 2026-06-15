import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import prerender from "@prerenderer/rollup-plugin";
import path from "path";

const prerenderedRoutes = ["/en", "/no", "/privacy", "/cookies", "/terms"];

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    {
      name: "kasta-prerender-preview-routes",
      configurePreviewServer(server) {
        server.middlewares.use((request, _response, next) => {
          const pathname = request.url?.split("?")[0]?.replace(/\/+$/, "") || "/";

          if (prerenderedRoutes.includes(pathname)) {
            request.url = request.url?.replace(pathname, `${pathname}/index.html`);
          }

          next();
        });
      },
    },
    mode === "production" &&
      prerender({
        routes: ["/", ...prerenderedRoutes],
        renderer: "@prerenderer/renderer-puppeteer",
        rendererOptions: {
          maxConcurrentRoutes: 1,
          skipThirdPartyRequests: true,
          timeout: 30000,
          pageSetup: async (page) => {
            await page.evaluateOnNewDocument(() => {
              window.localStorage.removeItem("kasta-language");
            });
          },
          pageHandler: async (page, route) => {
            const expectedTextByRoute: Record<string, string> = {
              "/": "Automate your business",
              "/en": "Automate your business",
              "/no": "Automatiser bedriften din",
              "/privacy": "Privacy Policy",
              "/cookies": "Cookie Policy",
              "/terms": "Terms of Service",
            };

            const expectedText = expectedTextByRoute[route] ?? "Kasta Flow Studio";

            await page.waitForFunction(
              (text) =>
                document.body.innerText.includes(text) &&
                !!document.head.querySelector('link[rel="canonical"][data-rh="true"]'),
              { timeout: 30000 },
              expectedText,
            );

            await page.evaluate(() => {
              const helmetManagedSelectors = [
                'link[rel="icon"]',
                'link[rel="shortcut icon"]',
                'link[rel="apple-touch-icon"]',
                'link[rel="manifest"]',
                'link[rel="canonical"]',
                'link[rel="alternate"][hreflang]',
                'meta[name="description"]',
                'meta[name="author"]',
                'meta[name="theme-color"]',
                'meta[name="format-detection"]',
                'meta[name="robots"]',
                'meta[property^="og:"]',
                'meta[name^="twitter:"]',
              ];

              for (const selector of helmetManagedSelectors) {
                if (!document.head.querySelector(`${selector}[data-rh="true"]`)) continue;
                document.head
                  .querySelectorAll(`${selector}:not([data-rh="true"])`)
                  .forEach((element) => element.remove());
              }

              document
                .querySelectorAll('script[src*="googletagmanager.com/gtag/js"]')
                .forEach((element) => element.remove());
            });
          },
        },
        postProcess(renderedRoute) {
          renderedRoute.html = renderedRoute.html.replace(
            /http:\/\/(?:localhost|127\.0\.0\.1):\d+/g,
            "https://kastaflow.com",
          );
        },
      }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-lottie': ['@lottiefiles/dotlottie-react'],
          'vendor-animations': ['framer-motion'],
        },
      },
    },
  },
}));
