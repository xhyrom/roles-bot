import { APIInteractionResponse } from "discord-api-types/v10";

export default function (response: APIInteractionResponse) {
	return new Response(JSON.stringify(response), {
		headers: { "content-type": "application/json" },
	});
}

export function respondAttachments(
	response: APIInteractionResponse,
	attachments: Record<string, string>,
) {
	const body = new FormData();
	body.append("payload_json", JSON.stringify(response));

	let i = 0;
	for (const [name, content] of Object.entries(attachments)) {
		body.append(
			`files[${i}]`,
			new Blob([content], { type: "text/plain" }),
			name,
		);
		i++;
	}

	return new Response(body);
}
