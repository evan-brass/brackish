import Trait from '../lib/trait.mjs';

export const ApplyExpression = new Trait("Override default expression application for this object.");

export function apply_expression(node, expression) {
	const expr_type = typeof expression;

	// Handle ApplyExpression
	if (expression instanceof ApplyExpression) {
		return expression[ApplyExpression].apply_expression(node) ?? node;
	} else if (node instanceof ApplyExpression) {
		node = node[ApplyExpression].into_raw();
	}

	if (expr_type == 'function') {
		const new_expr = expression(node);
		return apply_expression(node, new_expr);
	} else if (expr_type == 'undefined' || expression === null) {
		// Do Nothing
		return node;
	} else if (expr_type == 'object' && expression[Symbol.iterator] !== undefined) {
		if (node instanceof Comment) {
			// Create a range at the comment
			const range = new Range();
			range.selectNode(node);
			node.remove();
			for (const sub_expression of expression) {
				apply_expression(range, sub_expression);
			}
			return range;
		} else {
			for (const sub_expression of expression) {
				apply_expression(node, sub_expression);
			}
			return node;
		}
	} else if (node instanceof Attr) {
		node.value = String(expression);
		return node;
	} else if (node instanceof Text && expr_type !== 'object') {
		node.data = String(expression);
		return node;
	}

	// If the expression is a document fragment, then we need to convert the node to be a range:
	if (expression instanceof DocumentFragment && !(node instanceof Range)) {
		if (node instanceof Node) {
			const range = new Range();
			range.selectNode(node);
			node.remove();
			node = range;
		}
	}

	// For the remaining applications, we need the expression to be a node:
	if (!(expression instanceof Node)) {
		expression = new Text(String(expression));
	}

	if (node instanceof Range) {
		// We always append to the end of the Range.
		const temp = node.cloneRange();
		temp.collapse(false);
		temp.insertNode(expression);
		node.setEnd(temp.endContainer, temp.endOffset);
		return node;
	} else if (typeof node?.replaceWith == 'function') {
		node.replaceWith(expression);
		return expression;
	}

	throw new Error("This expression can't be applied at this location.");
}
