// from https://gist.github.com/devsnek/77275f6e3f810a9545440931ed314dc1

import type { Env } from "../types";

function hex2bin(hex: string) {
	const buf = new Uint8Array(Math.ceil(hex.length / 2));
	for (let i = 0; i < buf.length; i++) {
		buf[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
	}
	return buf;
}

const encoder = new TextEncoder();

export function getAlgorithm() {
	// @ts-expect-error
	return typeof MINIFLARE !== "undefined" ? "Ed25519" : "NODE-ED25519";
}

export async function verify(request: Request, env: Env) {
	const subtle = await crypto.subtle.importKey(
		"raw",
		hex2bin(env.publicKey),
		{
			name: getAlgorithm(),
			namedCurve: getAlgorithm(),
		},
		true,
		["verify"],
	);

	// rome-ignore lint/style/noNonNullAssertion: its fine
	const signature = hex2bin(request.headers.get("X-Signature-Ed25519")!);
	const timestamp = request.headers.get("X-Signature-Timestamp");
	const unknown = await request.clone().text();

	return await crypto.subtle.verify(
		getAlgorithm(),
		subtle,
		signature,
		encoder.encode(timestamp + unknown),
	);
}
