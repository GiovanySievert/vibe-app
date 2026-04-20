import { ZodError } from 'zod';

export function validationMapErrors<T extends Record<string, string>>(
  error: ZodError,
  stateShape: T
): T {
  const { fieldErrors } = error.flatten();
  const fieldErrorsMap = fieldErrors as Record<string, string[] | undefined>;
  const out: Record<string, string> = {};

  for (const key of Object.keys(stateShape)) {
    out[key] = fieldErrorsMap[key]?.[0] ?? '';
  }

  return out as T;
}
