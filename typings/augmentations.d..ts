export {};

// resolve conflict between react-redux connect and rematch dispatch typings
declare module "react-redux" {
  interface Connect {
    <no_state = {}, TDispatchProps = {}, TOwnProps = {}>(
      mapStateToProps: null | undefined,
      mapDispatchToProps: (
        dispatch: import("../src/store").Dispatch
      ) => TDispatchProps
    ): InferableComponentEnhancerWithProps<TDispatchProps, TOwnProps>;

    <TStateProps = {}, TDispatchProps = {}, TOwnProps = {}, State = {}>(
      mapStateToProps: MapStateToPropsParam<TStateProps, TOwnProps, State>,
      mapDispatchToProps: (
        dispatch: import("../src/store").Dispatch
      ) => TDispatchProps
    ): InferableComponentEnhancerWithProps<
      TStateProps & TDispatchProps,
      TOwnProps
    >;
  }
}
