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

// Get the build target from environment variable, default to content
const target = process.env.BUILD_TARGET || "content";

const config = {
  content: {
    input: resolve(__dirname, "src/content.ts"),
    output: "content.js",
  },
  sidebar: {
    input: resolve(__dirname, "src/sidebar.ts"),
    output: "sidebar.js",
  },
  serviceWorker: {
    input: resolve(__dirname, "src/serviceWorker.ts"),
    output: "serviceWorker.js",
  },
};

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        dev: process.env.NODE_ENV !== "production",
      },
    }),
    copyFiles(),
  ],
  build: {
    lib: {
      entry: config[target].input,
      name: target,
      fileName: () => config[target].output,
      formats: ["iife"],
    },
    outDir: "dist",
    emptyOutDir: target === "content",
    sourcemap: true,
  },
});
