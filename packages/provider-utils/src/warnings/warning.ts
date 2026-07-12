import type { Warning } from "@nurovia/core";

export function createUnsupportedSettingWarning(feature: string, details?: string): Warning {
  return {
    type: "unsupported",
    feature,
    details,
  };
}

export function createWarning(message: string): Warning {
  return {
    type: "other",
    message,
  };
}
