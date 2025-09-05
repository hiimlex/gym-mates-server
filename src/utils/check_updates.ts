import { Document } from "mongoose";

/**
 * Compare old mongoose document with newData and return only the changed fields.
 */
export function getChangedFields<T extends Document>(
  doc: T,
  newData: Partial<T>
): Partial<T> {
  const changes: Partial<T> = {};

  for (const [key, value] of Object.entries(newData)) {
    // @ts-ignore: dynamic key access
    const oldValue = doc[key];

    // Handle ObjectId / Date comparisons
    const isDifferent =
      value instanceof Date
        ? oldValue?.getTime?.() !== value.getTime()
        : value?.toString?.() !== oldValue?.toString?.();

    if (isDifferent) {
      // @ts-ignore
      changes[key] = value;
    }
  }

  return changes;
}