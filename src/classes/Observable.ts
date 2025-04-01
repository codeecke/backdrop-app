type TObserver = () => void;

export class Observable {
  private observers: TObserver[] = [];
  subscribe(observer: TObserver): number {
    const newIndex = this.observers.length;
    this.observers.push(observer);
    return newIndex;
  }

  notify() {
    this.observers.filter((item) => !!item).forEach((observer) => observer());
  }

  unsubscribe(handler: number) {
    delete this.observers[handler];
  }
}
