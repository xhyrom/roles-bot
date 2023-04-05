import "./commands/setup";
import { COMMANDS } from "./registers";

console.log(COMMANDS);

export default {
	fetch: (request: Request) => {
		console.log(request);
		return new Response("asda");
	},
};
