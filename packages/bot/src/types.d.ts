// secrets: wrangler secret put <name>
declare let MINIFLARE; // just check because algorithm is different

declare interface Env {
	publicKey: string;
	token: string;
}
