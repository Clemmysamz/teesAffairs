import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "tees_affairs_admin";

function constantTimeEqual(actual: string, expected: string) {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

export function verifyAdminCredentials(username: string, password: string) {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  return Boolean(
    expectedUsername &&
      expectedPassword &&
      constantTimeEqual(username, expectedUsername) &&
      constantTimeEqual(password, expectedPassword),
  );
}

export function isAdminSessionValid(token: string | undefined) {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!token || !username || !password) return false;

  const expectedToken = createHmac("sha256", password).update(username).digest("hex");
  return constantTimeEqual(token, expectedToken);
}

export function createAdminSessionToken() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) throw new Error("Admin credentials are not configured.");

  return createHmac("sha256", password).update(username).digest("hex");
}
