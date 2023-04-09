import { APIInteractionResponse } from "discord-api-types/v10";

export default function (response: APIInteractionResponse) {
	return new Response(JSON.stringify(response), {
		headers: { "content-type": "application/json" },
	});
}
