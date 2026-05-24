// @ts-ignore
/* eslint-disable */
import { request } from "@/utils/request";

/** Health Check GET /api/health */
export async function healthCheckApiHealthGet(options?: {
  [key: string]: any;
}) {
  return request<Record<string, any>>("/api/health", {
    method: "GET",
    ...(options || {}),
  });
}
