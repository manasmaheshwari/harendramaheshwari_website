export function reportLovableError(error: Error, context?: Record<string, unknown>) {
  console.error('[LovableError]', error, context);
}
