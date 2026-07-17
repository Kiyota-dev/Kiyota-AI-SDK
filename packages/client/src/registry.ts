import type { Provider } from "@kiyota/core";
import { ConfigurationError } from "@kiyota/core";

export class ProviderRegistry {
  private readonly providers = new Map<string, Provider>();

  register(name: string, provider: Provider): void {
    this.providers.set(name, provider);
  }

  get(name: string): Provider {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new ConfigurationError(`Provider "${name}" is not registered`);
    }
    return provider;
  }

  list(): string[] {
    return Array.from(this.providers.keys());
  }
}
