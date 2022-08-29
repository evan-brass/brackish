// Event Handling
export function on(event, handler, options = {}) {
	return node => {
		if ('addEventListener' in node) {
			node.addEventListener(event, handler, options);
		} else {
			throw new Error("on only works with EventTargets");
		}
	};
}
