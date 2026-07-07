import type { RequestConfig } from "./request.js";
import type { TransportResponse, TransportResponseChunk } from "./response.js";

export interface Transport {
  request<T>(config: RequestConfig): Promise<TransportResponse<T>>;
  stream(config: RequestConfig): AsyncIterable<TransportResponseChunk>;
}
