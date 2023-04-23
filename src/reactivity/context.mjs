let context_func = false;

export function context(func) {
	const prev_ctx = context_func;
	context_func = func;

	try {
		func();
	} finally {
		context_func = prev_ctx;
	}
}

let waiters = false;

function propagate() {
	const contexts = waiters;
	waiters = false;
	for (const ctx of contexts) {
		context(ctx);
	}
}

export class WaitSet extends Set {
	aquire() {
		if (context_func) {
			this.add(context_func);
		}
	}
	queue() {
		if (this.size == 0) return;
		if (!waiters) {
			waiters = new Set();
			queueMicrotask(propagate);
		}
		waiters.add(...this.values());
		this.clear();
	}
}
