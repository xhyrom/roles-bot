export default {
	fetch: (request: Request) => {
		console.log(request);
		return new Response("asda");
	},
};
