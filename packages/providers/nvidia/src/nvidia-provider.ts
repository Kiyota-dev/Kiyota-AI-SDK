import {
  createOpenAICompatibleProvider,
  type OpenAICompatibleProvider,
  type OpenAICompatibleProviderSettings,
} from "@kiyota/provider-openai-compatible";

export type NVIDIAProviderSettings = OpenAICompatibleProviderSettings;
export type NVIDIAProvider = OpenAICompatibleProvider;

/** Create an NVIDIA NIM provider. */
export function createNVIDIA(options: NVIDIAProviderSettings = {}): NVIDIAProvider {
  return createOpenAICompatibleProvider({
    baseURL: options.baseURL ?? "https://integrate.api.nvidia.com/v1",
    name: options.name ?? "nvidia",
    ...options,
  });
}
