import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

function matchesSecret(value: string | undefined, expected: string | undefined) {
  if (!value || !expected) return false;
  const actualBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

export async function hasOpsAccess() {
  const cookieStore = await cookies();
  return matchesSecret(cookieStore.get("ops_session")?.value, process.env.OPS_ACCESS_TOKEN);
}

export function hasCronAccess(request: Request) {
  const authorization = request.headers.get("authorization");
  const token = authorization?.replace(/^Bearer\s+/i, "");
  return matchesSecret(token, process.env.CRON_SECRET);
}

export { matchesSecret };
