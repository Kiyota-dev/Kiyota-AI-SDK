export interface StreamChunk {
  content: string;
  model?: string;
  provider?: string;
  finishReason?: string;
}
