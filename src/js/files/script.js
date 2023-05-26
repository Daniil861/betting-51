import { deleteMoney, checkRemoveAddClass, noMoney, getRandom, addMoney } from './functions.js';
import { startData } from './startData.js';


export function initStartData() {

	if (sessionStorage.getItem('money')) {
		writeScore();
	} else {
		sessionStorage.setItem('money', startData.bank);
		writeScore();
	}

	if (!sessionStorage.getItem('current-bet')) {
		sessionStorage.setItem('current-bet', startData.countBet);
		if (document.querySelector('.bet-box__bet')) document.querySelector('.bet-box__bet').textContent = sessionStorage.getItem('current-bet');
	} else {
		if (document.querySelector('.bet-box__bet')) document.querySelector('.bet-box__bet').textContent = sessionStorage.getItem('current-bet');
	}

	if (document.querySelector('.main')) {
		drawPrices();

		drawStartCurrentSubject();
		checkBoughtSubjects();
		checkCurrentSubject();
		writeSelected();
	}
}

function writeScore() {
	if (document.querySelector('.score')) {
		document.querySelectorAll('.score').forEach(el => {
			el.textContent = sessionStorage.getItem('money');
		})
	}
}

initStartData();


//========================================================================================================================================================
//main

initStartData();

function drawPrices() {
	document.querySelector('[data-price="2"]').textContent = startData.prices.price_2;
	document.querySelector('[data-price="3"]').textContent = startData.prices.price_3;
}

function drawStartCurrentSubject() {
	if (!sessionStorage.getItem('current-subject')) sessionStorage.setItem('current-subject', 1);
	if (!sessionStorage.getItem('subject-1')) sessionStorage.setItem('subject-1', true);
}

export function checkBoughtSubjects() {
	if (sessionStorage.getItem('subject-1')) {
		document.querySelector('[data-shop-button="1"]').innerHTML = `<span>Select</span>`;
		document.querySelector('[data-subject="1"]').classList.add('_bought');
	}
	if (sessionStorage.getItem('subject-2')) {
		document.querySelector('[data-shop-button="2"]').innerHTML = `<span>Select</span>`;
		document.querySelector('[data-subject="2"]').classList.add('_bought');
	}
	if (sessionStorage.getItem('subject-3')) {
		document.querySelector('[data-shop-button="3"]').innerHTML = `<span>Select</span>`;
		document.querySelector('[data-subject="3"]').classList.add('_bought');
	}
}
export function writeSelected() {
	if (+sessionStorage.getItem('current-subject') === 1) {
		document.querySelector('[data-shop-button="1"] span').textContent = `Selected`;
		document.querySelector('[data-subject="1"]').classList.add('_selected');
	} else if (+sessionStorage.getItem('current-subject') === 2) {
		document.querySelector('[data-shop-button="2"] span').textContent = `Selected`;
		document.querySelector('[data-subject="2"]').classList.add('_selected');
	} else if (+sessionStorage.getItem('current-subject') === 3) {
		document.querySelector('[data-shop-button="3"] span').textContent = `Selected`;
		document.querySelector('[data-subject="3"]').classList.add('_selected');
	}
}

function checkCurrentSubject() {
	let subject = +sessionStorage.getItem('current-subject');
	if (subject) {
		checkRemoveAddClass('.shop__item', '_selected', document.querySelector(`[data-subject="${subject}"]`));
	}
}

initStartData();
//========================================================================================================================================================
