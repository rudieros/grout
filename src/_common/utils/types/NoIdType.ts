export type NoId<T extends { id: string }> = Omit<T, 'id'>
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
