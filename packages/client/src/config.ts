import type { AIConfig as CoreAIConfig } from "@nurovia/core";
import type { Middleware } from "@nurovia/middleware";

export interface AIConfig extends CoreAIConfig {
  middleware?: Middleware[];
}
