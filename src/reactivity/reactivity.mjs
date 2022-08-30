let context;

export function x(func) {
	const prev_context = context;
	context = func;
	func();
	context = prev_context;
}

let update_set;
function propagate_changes() {
	const updates = update_set;
	update_set = undefined;

	for (const update of updates) {
		x(update);
	}
}
export function queue_propagation() {
	if (!update_set) {
		queueMicrotask(propagate_changes);
		update_set = new Set();
	}
}

export class WaitSet extends Set {
	aquire() {
		this.add(context);
	}
	enqueue() {
		queue_propagation();
		update_set.add(...this);
	}
}

export function d(initial_value, { did_change = (a,b) => a !== b } = {}) {
	let value = initial_value;
	const ws = new WaitSet();
	function get() {
		ws.aquire();
		return value;
	}
	function set(new_value) {
		if (did_change(value, new_value)) {
			value = new_value;
			ws.enqueue();
		}
	}
	return [get, set];
}
