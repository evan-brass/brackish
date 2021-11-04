export default class Trait {
	constructor(description) {
		this.symbol = Symbol(description);
	}
	[Symbol.toPrimitive]() {
		return this.symbol;
	}
	get [Symbol.toStringTag]() {
		return `Trait(${this.symbol.description})`
	}
	[Symbol.hasInstance](target) {
		return typeof target == 'object' && target[this.symbol] !== undefined;
	}
}