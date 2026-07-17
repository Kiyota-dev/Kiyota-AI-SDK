import type { Warning } from "@kiyota/core";

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
