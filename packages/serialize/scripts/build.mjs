import esbuild from "esbuild";
import { rmSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

if (existsSync(join(__dirname, "..", "dist")))
	rmSync(join(__dirname, "..", "dist"), { recursive: true });

const watch = process.argv.includes("--watch");
const dev = process.argv.includes("--dev");

Promise.all([
	esbuild.build({
		bundle: true,
		logLevel: "info",
		format: "esm",
		mainFields: ["browser", "module", "main"],
		platform: "neutral",
		target: "es2020",
		entryPoints: ["./src/index.ts"],
		outfile: "./dist/index.mjs",
		sourcemap: dev,
		charset: "utf8",
		minify: !dev,
		watch: watch,
	}),
])
	.catch((err) => {
		console.error("Serialize failed to build");
		console.error(err.message);
	})
	.then(() => {
		console.log(
			watch ? "Waiting for your changes..." : "Serialize has been built",
		);
	});
