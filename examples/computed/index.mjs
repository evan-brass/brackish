import { mount, html, Signal, Computed, on } from 'brackish';

const a = new Signal(5);
const b = new Signal(10);
const c = new Signal(6);

/* Function based: */
// const ab = () => {
// 	console.log('computing ab');
// 	return a.value + b.value;
// };
// const abc = () => {
// 	console.log('computing abc');
// 	return ab() + c.value;
// };

/* Computed based: */
const ab = new Computed(() => {
	console.log('computing ab');
	return a.value + b.value;
});
const abc = new Computed(() => {
	console.log('computing abc');
	return ab.value + c.value;
});

mount(html`
	<p>Initial value for a: ${a.value}</p>
	<p>Live updating value of a: ${a}</p>

	<h2>Computed Tests:</h2>
	<label>
		<input type="range" value="${a.value}" min="1" max="10" step="1" ${on('input', e => a.value = e.target.valueAsNumber)}>
		a: ${a}
	</label><br>
	<label>
		<input type="range" value="${b.value}" min="1" max="10" step="1" ${on('input', e => b.value = e.target.valueAsNumber)}>
		b: ${b}
	</label><br>
	<label>
		<input type="range" value="${c.value}" min="1" max="10" step="1" ${on('input', e => c.value = e.target.valueAsNumber)}>
		c: ${c}
	</label><br>
	<label>
		a + b: <input type="number" disabled value="${ab}">
	</label><br>
	<label>
		(a + b) + c: <input type="number" disabled value="${abc}">
	</label><br>
`);
