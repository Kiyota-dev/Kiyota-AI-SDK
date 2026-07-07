export interface TransportResponse<T> {
  status: number;
  headers: Record<string, string>;
  data: T;
}

export interface TransportResponseChunk {
  bytes: Uint8Array;
  done: boolean;
}
