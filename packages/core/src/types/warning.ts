export interface Warning {
  type: "unsupported" | "other";
  feature?: string;
  details?: string;
  message?: string;
}
