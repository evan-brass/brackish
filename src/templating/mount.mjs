import { apply_expression } from "./apply-expression.mjs";

export function mount(expression, node = document.querySelector('main') ?? document.body) {
	const temp = new Range();
	temp.selectNodeContents(node);
	apply_expression(temp, expression);
};
