type RequestOptions = {
  method?: string;
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
};

export async function request<T = unknown>(url: string, options: RequestOptions = {}): Promise<T> {
  void url;
  void options;
  throw new Error("miniapp request adapter is wired in the Taro implementation layer");
}
