export interface EventBody<T extends string, P> {
  type: T;
  payload: P;
}
