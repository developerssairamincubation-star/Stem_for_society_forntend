import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";


/**
 * Dev server only: turns `import { A, B } from "@phosphor-icons/react"` (and lucide-react) into one import per icon.
 *
 * Vite's dev server pre-bundles a package as a single file, and these two icon libraries are huge (6.6 MB and 1.2 MB of
 * JavaScript sent to the browser on every page, parsed on every reload). Production builds already tree-shake them down to the
 * icons used, so this plugin never runs for `vite build`. Names that have no per-icon file (types, for example) stay in the
 * original import, so nothing breaks.
 */
function perIconImports() {
  const root = process.cwd();
  const phosphor = (n: string) => fs.existsSync(path.join(root, "node_modules/@phosphor-icons/react/dist/csr", `${n}.es.js`));
  const kebab = (n: string) => n.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Za-z])([0-9])/g, "$1-$2").toLowerCase();
  const lucideFile = (n: string) => {
    for (const candidate of [kebab(n), n.endsWith("Icon") ? kebab(n.slice(0, -4)) : ""]) {
      if (candidate && fs.existsSync(path.join(root, "node_modules/lucide-react/dist/esm/icons", `${candidate}.js`))) return candidate;
    }
    return null;
  };
  const re = /import\s*\{([^}]*)\}\s*from\s*(['"])(@phosphor-icons\/react|lucide-react)\2;?/g;
  return {
    name: "per-icon-imports",
    apply: "serve" as const,
    enforce: "pre" as const,
    transform(code: string, id: string) {
      if (!/\/src\/.*\.(tsx?|jsx?)$/.test(id) || id.includes("node_modules")) return null;
      if (!code.includes("@phosphor-icons/react") && !code.includes("lucide-react")) return null;
      let changed = false;
      const out = code.replace(re, (whole, list: string, _q: string, pkg: string) => {
        const keep: string[] = [];
        const lines: string[] = [];
        for (const raw of list.split(",")) {
          const spec = raw.trim();
          if (!spec) continue;
          if (spec.startsWith("type ")) {
            keep.push(spec);
            continue;
          }
          const [name, alias] = spec.split(/\s+as\s+/).map((x) => x.trim());
          if (pkg === "lucide-react") {
            const file = lucideFile(name);
            if (file) lines.push(`import ${alias ?? name} from "lucide-react/dist/esm/icons/${file}.js";`);
            else keep.push(spec);
          } else if (phosphor(name)) {
            lines.push(`import { ${name}${alias ? ` as ${alias}` : ""} } from "@phosphor-icons/react/dist/csr/${name}";`);
          } else {
            keep.push(spec);
          }
        }
        if (!lines.length) return whole;
        changed = true;
        if (keep.length) lines.unshift(`import { ${keep.join(", ")} } from "${pkg}";`);
        return lines.join("\n");
      });
      return changed ? { code: out, map: null } : null;
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  // vite.config.js
  build: {
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
  plugins: [perIconImports(), react()],
  // Served as plain per-icon files in dev (see perIconImports) instead of one pre-bundled barrel.
  optimizeDeps: { exclude: ["@phosphor-icons/react", "lucide-react"] },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
