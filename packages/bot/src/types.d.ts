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
	applicationId: string;
	redisApiClientKey: string;
	redisApiClientHost: string;
}

declare interface RoleId {
	label: string;
	description?: string;
	emoji: string;
	id: string;
	style?: string;
}

declare interface BasicData {
	channelId: string;
	originalMessageId?: string | null;
	selecting: "buttons" | "dropdowns";
	roleIds: RoleId[];
	message: {
		content: string;
		embedTitle: string;
		embedDescription: string;
		embedColor: string;
	};
}
