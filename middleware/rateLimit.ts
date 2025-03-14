import { NextRequest, NextResponse } from "next/server";

const rateLimit = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export function rateLimiter(
  options: RateLimitOptions = { limit: 10, windowMs: 60000 }
) {
  return async function middleware(req: NextRequest) {
    const ip = req.ip || "anonymous";

    const now = Date.now();

    const rateLimitData = rateLimit.get(ip) || {
      count: 0,
      resetTime: now + options.windowMs,
    };

    if (now > rateLimitData.resetTime) {
      rateLimitData.count = 0;
      rateLimitData.resetTime = now + options.windowMs;
    }

    rateLimitData.count++;

    rateLimit.set(ip, rateLimitData);

    if (rateLimitData.count > options.limit) {
      return new NextResponse(
        JSON.stringify({
          error: "Too many requests",
          message: "Rate limit exceeded. Please try again later.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": options.limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": Math.ceil(
              rateLimitData.resetTime / 1000
            ).toString(),
          },
        }
      );
    }

    return NextResponse.next();
  };
}
