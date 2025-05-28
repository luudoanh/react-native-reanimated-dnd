#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { minify } from "terser";

async function minifyFile(filePath) {
  try {
    const code = fs.readFileSync(filePath, "utf8");

    // For React Native libraries, we'll do minimal minification
    // Only remove comments and compress whitespace
    const result = await minify(code, {
      compress: false, // Disable all compression
      mangle: false, // Disable all mangling
      format: {
        comments: false, // Remove comments
        beautify: false, // Compress whitespace
        preserve_annotations: true,
        semicolons: true,
        braces: true,
      },
      parse: {
        ecma: 2018,
      },
      ecma: 2018,
    });

    if (result.code) {
      fs.writeFileSync(filePath, result.code);
      console.log(`✓ Minified: ${filePath}`);
    }
  } catch (error) {
    console.error(`✗ Error minifying ${filePath}:`, error.message);
    // If minification fails, just copy the original file
    console.log(`⚠ Keeping original: ${filePath}`);
  }
}

async function minifyDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      await minifyDirectory(filePath);
    } else if (file.endsWith(".js")) {
      await minifyFile(filePath);
    }
  }
}

async function main() {
  console.log("🚀 Starting minification...");
  await minifyDirectory("./lib");
  console.log("✅ Minification complete!");
}

main().catch(console.error);
