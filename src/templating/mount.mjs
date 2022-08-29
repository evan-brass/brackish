import { apply_expression } from "./apply-expression.mjs";

export function mount(expression, node = document.querySelector('main') ?? document.body) {
	const temp = new Comment();
	node.appendChild(temp);
	apply_expression(temp, expression);
};
