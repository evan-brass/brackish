import { x, d } from "../../src/reactivity/reactivity.mjs";
import { mount } from "../../src/templating/mount.mjs";
import { html } from "../../src/templating/html.mjs";
import { on } from "../../src/templating/expressions.mjs";
import { apply_expression } from "../../src/templating/apply-expression.mjs";

const [count, set_count] = d(10);

function swapping(compute) {
	return function (node) {
		x(() => {
			node = apply_expression(node, compute());
		});
	};
}

mount(html`
	<button ${on('click', () => set_count(count() - 1))}>-</button>
	${swapping(() => count())}
	<button ${on('click', () => set_count(count() + 1))}>+</button>
`);
