import { ListenerSignature, TypedEmitter } from "tiny-typed-emitter";

export class SubscribableEmitter<L extends ListenerSignature<L>> extends TypedEmitter<L> {
  private subscribers = new Set<L>();

  addSubscriber(subscriber: L) {
    this.subscribers.add(subscriber);
  }

  removeSubscriber(subscriber: L) {
    this.subscribers.delete(subscriber);
  }

  emit<U extends keyof L>(event: U, ...args: Parameters<L[U]>): boolean {
    let hasSubscriber = false;

    for (const subscriber of this.subscribers) {
      if (subscriber[event]) {
        hasSubscriber = true;
        subscriber[event](...args);
      }
    }

    return hasSubscriber || super.emit(event, ...args);
  }
}
