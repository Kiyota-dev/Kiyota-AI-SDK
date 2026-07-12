export function loadOptionalSetting({
  settingValue,
  environmentVariableName,
}: {
  settingValue: string | undefined;
  environmentVariableName: string;
}): string | undefined {
  return settingValue ?? process.env[environmentVariableName];
}
