export function get_path(target, root, attribute_name = false) {
	const path = attribute_name ? [attribute_name] : [];
	while (target !== root) {
		const parent = target.parentNode;
		path.unshift(Array.prototype.indexOf.call(parent.childNodes, target));
		target = parent;
	}
	return path;
}

// Merging paths only works if the paths were in document order to begin with, otherwise the output order will be off.
export function merge_paths(into, from) {
	let i = 0;
	let arr = into;
	while (Array.isArray(arr[i]) || (i < arr.length && from.length)) {
		if (Array.isArray(arr[i])) {
			// If the array matches our path, then step into that array, otherwise skip it.
			if (from.length && arr[i][0] == from[0]) {
				arr = arr[i];
				from.shift();
			}
			i += 1;
		} else if (arr[i] === from[0]) {
			i += 1;
			from.shift();
		} else {
			break;
		}
	}

	arr.push(arr.splice(i), ...from);

	return into;
}

// Descend the paths and yield the nodes it selects
export function descend_paths(paths, node, ret = []) {
	if (paths == undefined) return ret;
	for (const step in paths) {
		if (typeof step == 'string') {
			ret.push(node.getAttributeNode(step));
		} else if (Array.isArray(step)) {
			descend_paths(step, node, ret);
		} else if (typeof step == 'number') {
			node = node.childNodes[step];
		} else {
			throw new Error("Malformed paths");
		}
	}
	if (typeof paths[paths.length - 1] !== 'string') ret.push(node);
	return ret;
}
