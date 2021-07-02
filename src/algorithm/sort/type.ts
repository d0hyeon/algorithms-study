
export type SortFunction<T = number> = (array: T[]) => T[];
export type Sort<T = number> = (array: T[], sortFunction: SortFunction<T>) => T[]; 
export type SortPromise<T = number> = (array: T[], sortFunction: SortFunction<T>) => Promise<T[]>;