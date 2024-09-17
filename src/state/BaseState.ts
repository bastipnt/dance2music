type Subscription<S> = (newState: S) => void;

abstract class BaseState<S> {
  public state: S;
  private listeners: Subscription<S>[] = [];

  constructor(initialState: S) {
    this.state = initialState;
  }

  abstract execute(value?: any): void;

  getState(): S {
    return this.state;
  }

  updateState(newState: Partial<S>): void {
    this.state = {
      ...this.state,
      ...newState,
    };

    if (this.listeners.length) {
      this.listeners.forEach((listener) => listener(this.state));
    }
  }

  subscribe(listener: Subscription<S>) {
    this.listeners.push(listener);
  }
}

export default BaseState;
