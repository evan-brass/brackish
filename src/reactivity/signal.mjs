import { context, WaitSet } from "./context.mjs";

export class Signal {
	#waiters = new WaitSet();
	#value;
	constructor(initial_value) {
		this.#value = initial_value;
	}
	get value() {
		this.#waiters.aquire();
		return this.#value;
	}
	set value(new_value) {
		this.#value = new_value;
		this.#waiters.queue();
		return true;
	}
}

const Uncomputed = Symbol("value has not been a calculated yet.");
// This implementation of computed doesn't check whether it's result value was unchanged, it just memoizes the result of a computation so that it only happens once per propagation.
export class Computed {
	#waiters = new WaitSet();
	#value = Uncomputed;
	compute;
	constructor(compute) {
		this.compute = compute;
	}
	get value() {
		this.#waiters.aquire();
		if (this.#value == Uncomputed) {
			context(() => {
				if (this.#value == Uncomputed) {
					this.#value = this.compute();
				} else {
					this.#value == Uncomputed;
					this.#waiters.queue();
				}
			});
		}
		return this.#value;
	}
}
