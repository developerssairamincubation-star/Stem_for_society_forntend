import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // '' loads every variable, not just VITE_*. Only VITE_* ever reach the
  // browser bundle; the SENTRY_* build secrets stay on the build machine.
  const env = { ...loadEnv(mode, process.cwd(), ""), ...process.env };

  /**
   * One release name shared by the SDK (tags each event) and the upload
   * (labels the source maps), so Sentry can match them. Vercel exposes the
   * commit SHA at build time, so no one has to remember to set it.
   */
  const release =
    env.VITE_APP_VERSION || env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || undefined;

  /**
   * Source maps turn minified production stack traces back into real file
   * names and line numbers. They are uploaded only when an auth token is
   * present (i.e. on the deploy build), generated as "hidden" so the bundle
   * never points at them, and deleted after upload so they are not served
   * publicly. Without the token the build is exactly as before.
   */
  const uploadSourceMaps = Boolean(
    env.SENTRY_AUTH_TOKEN && env.SENTRY_ORG && env.SENTRY_PROJECT,
  );

  return {
    define: release
      ? { "import.meta.env.VITE_APP_VERSION": JSON.stringify(release) }
      : {},
    build: {
      sourcemap: uploadSourceMaps ? "hidden" : false,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-supabase': ['@supabase/supabase-js'],
            // lucide-react and framer-motion are deliberately NOT listed. Naming a
            // package here forces it into a chunk every page downloads; left out,
            // Rollup tree-shakes them into just the route chunks that use them.
            'vendor-mantine': ['@mantine/core', '@mantine/hooks'],
            'vendor-radix': ['@radix-ui/react-dialog', '@radix-ui/react-popover'],
            'vendor-utils': ['axios', 'date-fns', 'dayjs', 'zod', 'react-hook-form', '@tanstack/react-query'],
            'vendor-icons': ['react-icons'],
            'vendor-charts': ['recharts']
          }
        }
      },
      chunkSizeWarningLimit: 2500
    },
    plugins: [
      react(),
      // Must stay last so it sees the final emitted files.
      sentryVitePlugin({
        disable: !uploadSourceMaps,
        org: env.SENTRY_ORG,
        project: env.SENTRY_PROJECT,
        authToken: env.SENTRY_AUTH_TOKEN,
        release: release ? { name: release } : undefined,
        sourcemaps: { filesToDeleteAfterUpload: ["./dist/**/*.map"] },
        telemetry: false,
        // A Sentry outage or expired token must not block a deploy: warn and
        // ship without readable stack traces rather than failing the build.
        errorHandler: (err) => {
          console.warn(`[sentry] source map upload failed: ${err.message}`);
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
