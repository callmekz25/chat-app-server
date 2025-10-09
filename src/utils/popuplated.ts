export type PopulatedMany<T, M extends Record<string, any>> = Omit<T, keyof M> &
  M;
