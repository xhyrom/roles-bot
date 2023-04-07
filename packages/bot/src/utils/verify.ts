// from https://gist.github.com/devsnek/77275f6e3f810a9545440931ed314dc1

"use strict";

function hex2bin(hex: string) {
	const buf = new Uint8Array(Math.ceil(hex.length / 2));
	for (let i = 0; i < buf.length; i++) {
		buf[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
	}
	return buf;
}

const encoder = new TextEncoder();

export async function verify(request: Request, env: Env) {
	const subtle = await crypto.subtle.importKey(
		"raw",
		hex2bin(env.publicKey),
		{
			name: typeof MINIFLARE !== "undefined" ? "Ed25519" : "NODE-ED25519",
			namedCurve: typeof MINIFLARE !== "undefined" ? "Ed25519" : "NODE-ED25519",
		},
		true,
		["verify"],
	);

	// rome-ignore lint/style/noNonNullAssertion: its fine
	const signature = hex2bin(request.headers.get("X-Signature-Ed25519")!);
	const timestamp = request.headers.get("X-Signature-Timestamp");
	const unknown = await request.clone().text();

	return await crypto.subtle.verify(
		typeof MINIFLARE !== "undefined" ? "Ed25519" : "NODE-ED25519",
		subtle,
		signature,
		encoder.encode(timestamp + unknown),
	);
}
