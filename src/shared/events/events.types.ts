export interface Event<T extends string, P> {
  type: T;
  payload: P;
}
