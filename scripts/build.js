#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { minify } from "terser";

async function minifyFile(filePath) {
  try {
    const code = fs.readFileSync(filePath, "utf8");

    const result = await minify(code, {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug"],
        passes: 2,
        unsafe: false,
        keep_fnames: false,
      },
      mangle: {
        reserved: ["React", "ReactNative", "createElement", "Fragment"],
        keep_fnames: false,
      },
      format: {
        comments: false,
        beautify: false,
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
