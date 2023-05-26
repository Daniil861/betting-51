import { deleteMoney, checkRemoveAddClass, noMoney, addMoney } from './functions.js';
import { initStartData, checkBoughtSubjects, writeSelected } from './script.js';
import { startData } from './startData.js';
import { config_game, startSelectStrong, startGame } from './ballGame.js';


// Объявляем слушатель событий "клик"

document.addEventListener('click', (e) => {

	let targetElement = e.target;
	let bank = +sessionStorage.getItem('money');

	if (targetElement.closest('.preloader__button')) {
		location.href = 'main.html';
	}

	if (targetElement.closest('[data-button="shop"]')) {
		writeSelected();
		document.querySelector('.main__body').classList.add('_shop');
	}
	if (targetElement.closest('.shop__button-back') && document.querySelector('.main')) {
		document.querySelector('.main__body').classList.remove('_shop');
	}

	if (targetElement.closest('[data-button="game"]')) {
		location.href = 'game.html';
	}

	if (targetElement.closest('[data-shop-button="1"]') && !targetElement.closest('[data-subject="1"]').classList.contains('_bought')) {
		if (bank >= startData.prices.price_1) {
			deleteMoney(startData.prices.price_1, startData.nameScore);
			sessionStorage.setItem('subject-1', true);
			checkBoughtSubjects();
		} else noMoney(startData.nameScore);
	} else if (targetElement.closest('[data-shop-button="1"]') && targetElement.closest('[data-subject="1"]').classList.contains('_bought')) {
		sessionStorage.setItem('current-subject', 1);
		checkRemoveAddClass('.shop__item', '_selected', targetElement.closest('[data-subject="1"]'));
		writeSelected();
	}

	if (targetElement.closest('[data-shop-button="2"]') && !targetElement.closest('[data-subject]').classList.contains('_bought')) {
		if (bank >= startData.prices.price_2) {
			deleteMoney(startData.prices.price_2, startData.nameScore);
			sessionStorage.setItem('subject-2', true);
			checkBoughtSubjects();
		} else noMoney(startData.nameScore);
	} else if (targetElement.closest('[data-shop-button="2"]') && targetElement.closest('[data-subject]').classList.contains('_bought')) {
		sessionStorage.setItem('current-subject', 2);
		checkRemoveAddClass('.shop__item', '_selected', targetElement.closest('[data-subject="2"]'));
		writeSelected();
	}

	if (targetElement.closest('[data-shop-button="3"]') && !targetElement.closest('[data-subject]').classList.contains('_bought')) {
		if (bank >= startData.prices.price_3) {
			deleteMoney(startData.prices.price_3, startData.nameScore);
			sessionStorage.setItem('subject-3', true);
			checkBoughtSubjects();
		} else noMoney(startData.nameScore);
	} else if (targetElement.closest('[data-shop-button="3"]') && targetElement.closest('[data-subject]').classList.contains('_bought')) {
		sessionStorage.setItem('current-subject', 3);
		checkRemoveAddClass('.shop__item', '_selected', targetElement.closest('[data-subject="3"]'));
		writeSelected();
	}

	// Важно чтобы данная функция была после блока с логикой кликов по кнопкам покупки
	initStartData();

	//game


	// Останавливаем движение стрелки и запускаем мяч
	if (targetElement.closest('.controls-game__button') && config_game.state === 2) {

		config_game.isMoveArrow = false;
		config_game.state = 3;

		setTimeout(() => {
			startGame();
		}, 500);
	}

	// Выбор силы удара
	if (targetElement.closest('.controls-game__button') && config_game.state === 1) {
		startSelectStrong();
	}


})