export interface LanguageModelV1Capabilities {
  supportsStreaming?: boolean;
  supportsToolCalls?: boolean;
  supportsVision?: boolean;
  supportsJSON?: boolean;
  supportsReasoning?: boolean;
  supportedUrls?: Record<string, RegExp[]>;
}
