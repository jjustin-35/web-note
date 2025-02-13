import { handler as authHandler } from "$lib/server/auth"
import type { Handle } from "@sveltejs/kit"

export const handle: Handle = authHandler.handle;
