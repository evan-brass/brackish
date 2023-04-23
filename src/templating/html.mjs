import create_template from './create-template.mjs';
import get_or_set from '../lib/get-or-set.mjs';
import { apply_expression, ApplyExpression } from './apply-expression.mjs';
import { descend_paths } from './descendant-path.mjs';
import { context } from '../reactivity/context.mjs';

// Cache: strings -> (HTMLTemplateElement, Paths)
const template_cache = new WeakMap();

class Html {
	constructor(strings, expressions) {
		this.strings = strings;
		this.expressions = expressions;
	}
	[ApplyExpression](node) {
		if (node instanceof Html && node.strings === this.strings) {
			if (this.expressions.length !== node.nodes.length) throw new Error("Template wasn't instantiated with the same number of expressions.");
			this.nodes = node.nodes;
			this.raw = node.raw;
			for (let i = 0; i < this.nodes.length; ++i) {
				context(() => {
					this.nodes[i] = apply_expression(this.nodes[i], this.expressions[i]);
				});
			}
		} else {
			// Get the template element:
			const { template, paths } = get_or_set(template_cache, this.strings, () => create_template(this.strings));

			// Instantiate our template:
			const fragment = document.importNode(template.content, true);

			// Retreive the parts using the paths:
			this.nodes = descend_paths(paths, fragment);

			if (this.expressions.length !== this.nodes.length) throw new Error("Template expects a different number of expressions: Usually an HTML syntax error. Check the permitted content rules.");

			// Apply the expressions to the parts:
			for (let i = 0; i < this.expressions.length; ++i) {
				context(() => {
					this.nodes[i] = apply_expression(this.nodes[i], this.expressions[i]);
				});
			}
			this.raw = apply_expression(node, fragment);
		}
		return this;
	}
}

export function html(strings, ...expressions) {
	return new Html(strings, expressions);
}
