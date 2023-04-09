export class RedisAPIClient {
	private apiKey: string;
	private host: string;

	constructor(apiKey: string, host: string) {
		this.apiKey = apiKey;
		this.host = host;
	}

	public async get(key: string): Promise<string> {
		const url = `${this.host}/get?key=${key}`;
		const response = await fetch(url, {
			headers: {
				Authorization: this.apiKey,
			},
		});

		return response.text();
	}

	public async set(key: string, value: string): Promise<string> {
		const url = `${this.host}/set`;
		const response = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: this.apiKey,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				key,
				value,
			}),
		});

		return response.text();
	}

	public async setex(
		key: string,
		value: string,
		seconds: number,
	): Promise<string> {
		const url = `${this.host}/setex`;
		const response = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: this.apiKey,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				key,
				value,
				seconds,
			}),
		});

		return response.text();
	}

	public async del(key: string): Promise<string> {
		const url = `${this.host}/del?key=${key}`;
		const response = await fetch(url, {
			headers: {
				Authorization: this.apiKey,
			},
		});

		return response.text();
	}
}
