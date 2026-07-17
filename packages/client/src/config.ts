import type { AIConfig as CoreAIConfig } from "@kiyota/core";
import type { Middleware } from "@kiyota/middleware";

export interface AIConfig extends CoreAIConfig {
  middleware?: Middleware[];
}
