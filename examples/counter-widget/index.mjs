import { mount, html, on, Signal } from 'brackish';

const count = new Signal(10);

mount(html`
	<button ${on('click', () => count.value -= 1)}>-</button>
	${count}
	<button ${on('click', () => count.value += 1)}>+</button>
`);
