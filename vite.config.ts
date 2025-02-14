/// <reference types="vitest" />
import { defineConfig } from "vite";

import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [preact(), tailwindcss()],
	build: {
		rollupOptions: {
			input: {
				content: "src/content.tsx",
			},
			output: {
				entryFileNames: "[name].js",
				format: "iife",
			},
		},
	},
	test: {
		watch: false,
	},
});
