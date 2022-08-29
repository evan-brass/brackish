import create_template from './create-template.mjs';
import get_or_set from '../lib/get-or-set.mjs';
import { apply_expression } from './apply-expression.mjs';
import { descend_paths } from './descendant-path.mjs';

// Cache: strings -> (HTMLTemplateElement, Paths)
const template_cache = new WeakMap();

export function html(strings, ...expressions) {
	// Get the template element:
	const { template, paths } = get_or_set(template_cache, strings, () => create_template(strings));

	// Instantiate our template:
	const fragment = document.importNode(template.content, true);

	// Retreive the parts using the paths:
	const parts = descend_paths(paths, fragment);

	if (expressions.length !== parts.length) throw new Error("Template didn't expects a different number of expressions: Usually an HTML syntax error. Check the permitted content rules.");

	// Apply the expressions to the parts:
	for (let i = 0; i < expressions.length; ++i) {
		apply_expression(expressions[i], parts[i]);
	}
	return fragment;
}
