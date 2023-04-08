import type { Generic } from "serialize";

// secrets: wrangler secret put <name>
declare let MINIFLARE; // just check because algorithm is different

declare type DeclaredId = Record<
	string,
	| string
	| {
			[key: string]: Generic;
	  }
> & {
	data: {
		[key: string]: Generic;
	};
};

declare interface Env {
	publicKey: string;
	token: string;
}
