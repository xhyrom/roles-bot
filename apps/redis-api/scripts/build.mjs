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
		platform: "node",
		target: "es2020",
		entryPoints: ["./src/index.ts"],
		outfile: "./dist/index.mjs",
		sourcemap: dev,
		charset: "utf8",
		minify: !dev,
		watch: watch,
		plugins: [
			{
				name: "make-all-packages-external",
				setup(build) {
					const filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/; // Must not start with "/" or "./" or "../"
					build.onResolve({ filter }, (args) => ({
						path: args.path,
						external: true,
					}));
				},
			},
		],
	}),
])
	.catch((err) => {
		console.error("Redis api failed to build");
		console.error(err.message);
	})
	.then(() => {
		console.log(
			watch ? "Waiting for your changes..." : "Redis api has been built",
		);
	});
