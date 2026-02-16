import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to safely get a value from Supabase joined data (can be object or array)
export function getJoinedValue<T>(
  joined: T | T[] | null | undefined,
  key: keyof NonNullable<T>
): unknown {
  if (!joined) return undefined;
  const item = Array.isArray(joined) ? joined[0] : joined;
  return item ? (item as NonNullable<T>)[key] : undefined;
}
