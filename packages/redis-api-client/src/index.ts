interface RedisClient {
  connect(): Promise<void> | void;

  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<string>;
  setex(key: string, value: string, seconds: number): Promise<string>;
  del(key: string): Promise<number>;
}

export class Upstash implements RedisClient {
  private url: string;
  private token: string;

  private redis: import("@upstash/redis").Redis | undefined;

  constructor(url: string, token: string) {
    this.url = url;
    this.token = token;

    this.redis = undefined;
  }

  public async connect() {
    if (this.redis) {
      return;
    }

    this.redis = new (await import("@upstash/redis")).Redis({
      url: this.url,
      token: this.token,
    });
  }

  public async get(key: string): Promise<string | null> {
    await this.connect();

    return (await this.redis?.get(key)) ?? null;
  }

  public async set(key: string, value: string): Promise<string> {
    await this.connect();

    return (await this.redis?.set(key, value)) ?? "OK";
  }

  public async setex(
    key: string,
    value: string,
    seconds: number
  ): Promise<string> {
    await this.connect();

    return (await this.redis?.setex(key, seconds, value)) ?? "OK";
  }

  public async del(key: string): Promise<number> {
    await this.connect();

    return (await this.redis?.del(key)) ?? 0;
  }
}

export class Raw implements RedisClient {
  private apiKey: string;
  private host: string;

  constructor(apiKey: string, host: string) {
    this.apiKey = apiKey;
    this.host = host;
  }

  public connect() {}

  public async get(key: string): Promise<string | null> {
    const url = `${this.host}/get?key=${key}`;
    const response = await fetch(url, {
      headers: {
        Authorization: this.apiKey,
      },
    });

    const text = await response.text();
    return text === "null" ? null : text;
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
    seconds: number
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

  public async del(key: string): Promise<number> {
    const url = `${this.host}/del?key=${key}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: this.apiKey,
      },
    });

    return parseInt(await response.text());
  }
}
