import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";
import fs from "fs";

// Custom plugin to copy files
function copyFiles() {
  return {
    name: "copy-files",
    writeBundle() {
      // Files to copy from src to dist
      const filesToCopy = [
        { src: "src/manifest.json", dest: "manifest.json" },
        { src: "src/sidebar.html", dest: "sidebar.html" },
      ];

      filesToCopy.forEach(({ src, dest }) => {
        const srcPath = resolve(__dirname, src);
        const destPath = resolve(__dirname, "dist", dest);

        if (fs.existsSync(srcPath)) {
          fs.copyFileSync(srcPath, destPath);
          console.log(`Copied ${src} to dist/${dest}`);
        } else {
          console.warn(`Warning: ${src} not found`);
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        dev: process.env.NODE_ENV !== "production",
      },
      preprocess: {
        style: ({ content }) => {
          return {
            code: content,
            map: null,
          };
        },
      },
    }),
    copyFiles(),
  ],
  build: {
    rollupOptions: {
      input: {
        content: resolve(__dirname, "src/content.ts"),
        sidebar: resolve(__dirname, "src/sidebar.ts"),
        "service-worker": resolve(__dirname, "src/service-worker.ts"),
      },
      output: {
        entryFileNames: "[name].js",
        inlineDynamicImports: false,
        assetFileNames: "assets/[name].[hash][extname]",
      },
    },
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
  },
});
