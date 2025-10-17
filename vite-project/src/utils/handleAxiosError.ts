import { AxiosError } from 'axios';

export function handleAxiosError(error: unknown): string {
  const err = error as AxiosError<{ message?: string }>;
  return err.response?.data?.message || err.message || 'Unknown error occurred';
}
