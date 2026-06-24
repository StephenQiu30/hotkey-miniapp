import Taro from "@tarojs/taro";

const API_BASE_URL = "http://localhost:8000";
export const HOTKEY_TOKEN = "HOTKEY_TOKEN";

type RequestOptions = {
  method?: string;
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
};

type APIErrorPayload = {
  error?: string;
  code?: string;
};

export class HotKeyAPIError extends Error {
  code?: string;
  status: number;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "HotKeyAPIError";
    this.status = status;
    this.code = code;
  }
}

export async function request<T = unknown>(url: string, options: RequestOptions = {}): Promise<T> {
  const token = Taro.getStorageSync<string>(HOTKEY_TOKEN);
  const query = buildQuery(options.params);
  const response = await Taro.request<T>({
    url: `${API_BASE_URL}${url}${query}`,
    method: normalizeMethod(options.method),
    data: options.data,
    header: {
      "Content-Type": "application/json",
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (response.statusCode >= 400) {
    throw toAPIError(response.statusCode, response.data);
  }

  return response.data;
}

function buildQuery(params?: Record<string, unknown>) {
  if (!params) {
    return "";
  }
  const searchParams = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);

  return searchParams.length ? `?${searchParams.join("&")}` : "";
}

function normalizeMethod(method?: string) {
  return (method?.toUpperCase() ?? "GET") as keyof Taro.request.Method;
}

function toAPIError(status: number, data: unknown): HotKeyAPIError {
  const fallbackMessage = `HotKey API request failed: ${status}`;
  if (isAPIErrorPayload(data)) {
    return new HotKeyAPIError(data.error || fallbackMessage, status, data.code);
  }

  return new HotKeyAPIError(fallbackMessage, status);
}

function isAPIErrorPayload(data: unknown): data is APIErrorPayload {
  return typeof data === "object" && data !== null && ("error" in data || "code" in data);
}
