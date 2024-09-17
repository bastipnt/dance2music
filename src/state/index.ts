import BaseState from "./BaseState";

type AppSateType = {
  rightArm: { x: number; y: number };
};

class AppState extends BaseState<AppSateType> {
  execute(_?: any): void {}
}

export default AppState;
