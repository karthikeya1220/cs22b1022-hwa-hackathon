const URL_KEY = "UPSTASH_REDIS_REST_URL";
const TOKEN_KEY = "UPSTASH_REDIS_REST_TOKEN";

function getConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    return null;
  }
  return { url: url.replace(/\/$/, ""), token };
}

export async function redisCommand<T>(
  command: (string | number)[],
): Promise<T> {
  const config = getConfig();
  if (!config) {
    throw new Error("Upstash Redis is not configured");
  }

  const res = await fetch(config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upstash request failed (${res.status}): ${text}`);
  }

  return (await res.json()) as T;
}

export async function redisSet(key: string, value: string, ttlSeconds: number) {
  await redisCommand(["SET", key, value, "EX", ttlSeconds]);
}

export async function redisGet(key: string): Promise<string | null> {
  const result = await redisCommand<unknown>(["GET", key]);
  if (typeof result === "string") return result;
  return null;
}

export function isUpstashConfigured(): boolean {
  return getConfig() !== null;
}
