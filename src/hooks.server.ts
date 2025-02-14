import { handler as authHandler } from "$lib/server/auth";
import type { Handle } from "@sveltejs/kit";
import { ALLOWED_ORIGINS } from "$env/static/private";

// 允許的來源清單，包含 Chrome Extension ID
const allowedOrigins = ALLOWED_ORIGINS ? ALLOWED_ORIGINS.split(',') : [];

export const handle: Handle = async ({ event, resolve }) => {
  const origin = event.request.headers.get('origin');
  
  // 檢查請求來源是否在允許清單中
  const isAllowedOrigin = origin && allowedOrigins.includes(origin);

  // 處理 CORS preflight 請求
  if (event.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Origin': isAllowedOrigin ? origin : '',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
        'Access-Control-Allow-Credentials': 'true',
        'Vary': 'Origin'
      }
    });
  }

  // 處理實際請求
  const response = await authHandler.handle({ event, resolve });
  
  // 如果是允許的來源，加入 CORS headers
  if (isAllowedOrigin) {
    const newHeaders = new Headers(response.headers);
    newHeaders.set('Access-Control-Allow-Origin', origin);
    newHeaders.set('Access-Control-Allow-Credentials', 'true');
    newHeaders.set('Vary', 'Origin');

    return new Response(response.body, {
      status: response.status,
      headers: newHeaders
    });
  }

  return response;
};
