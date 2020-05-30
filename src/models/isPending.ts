export const isPending = {
  state: false,
  reducers: {
    setIsPending: (state: boolean, payload: boolean): boolean => payload
  },
  effects: () => ({})
};
