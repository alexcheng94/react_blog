export type ErrorState = {
  status: number | null;
  statusText: string | null;
  message: string | null;
};

export const error = {
  state: { status: null, statusText: null, message: null },
  reducers: {
    clearError: (state: ErrorState): ErrorState => ({
      ...state,
      status: null,
      statusText: null,
      message: null
    })
  },
  effects: () => ({})
};
