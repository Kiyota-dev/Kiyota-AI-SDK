import { ValidationError } from "@nurovia/core";

export function assertDefined<T>(value: T | undefined, message: string): T {
  if (value === undefined) {
    throw new ValidationError(message);
  }
  return value;
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}
