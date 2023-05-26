import { addMoney, deleteMoney, getRandom } from "./functions.js";

// 1. Кликаем на кнопку играть:
//	++	1.1 Переводим состояние игры в положение 2 - выбор координат удара
//	++	1.2 Запускаем анимацию перемещения кеда
//	++	1.3 Запускаем анимацию отображения power - основываемся на показания верхнего индикатора
//	2. Повторно кликаем на кнопку играть:
//	++	2.0 Блокируем кнопку старт
//	++	2.1 Останавливаем индикаторы
//	++	2.2 Фиксируем значения, на которых остановились
//	++	2.3 Создаем мяч в нужной ячейке
//	++	2.4 В поле STATE записываем коэффициент, в который попали
//	3. Полет мяча:
//	++	3.1 На основании значения, которое получили при остановке бегающей стрелки - определяем в какую корзину запускаем мяч
//	++	3.2 Создаем в соответствующем блоке (container__item) новый мяч
//	++	3.3 Запускаем анимацию движения вниз. Проверяем на наличие припятствия внизу и боковых стен.
//	4. После остановки мяча:
//	++	4.1 Разблокируем кнопку старт
//	++	4.2 Добавляем деньги на счет
//	++5. После каждого запуска проверяем заполнена ли до конца ячейка - если заполнена, удаляем мячи из данной ячейки

export const config_game = {
	state: 1, // 1 - не играем, 2 - выбор силы удара (бегает стрелка), 3 - запускаем мяч
	strong: 0,
	bet: 50,

	// arrow
	arrow: document.querySelector('.switch__button'),
	arrowInner: document.querySelector('.switch__inner span'),

	// power
	powerBlocks: document.querySelectorAll('.indicator__items span'),

	baskets: document.querySelectorAll('.container__item'),

	isMoveArrow: false,

	vy: 16, // 16
	vx: 35, // 16
	gravity: 5, // -5

	winCoeff: 1,
	winCount: 0,
	randCoeff: null,

	targetBlock: 1,

	fps: 70,
	timer: 0,
	interval: 1000 / 70,
}

const balls = {
	balls: [],
	isBallMoving: false,

	idx: 0,
	idxToDelete: null,

	collide: false,

	wallBottom: document.querySelectorAll('.container__floor'),
}

// Анимируем индикаторы выбора силы
export function startSelectStrong() {

	// Делаем метку что стрелка активна
	config_game.isMoveArrow = true;

	// Делаем метку что состояние игры в режиме выбора силы удара
	config_game.state = 2;

	deleteMoney(config_game.bet, '.score');

	animateArrow();
}

function animateArrow() {

	config_game.vx += config_game.gravity;

	config_game.arrow.style.left = `${config_game.vx}%`;
	config_game.arrowInner.style.width = `${config_game.vx}%`;

	animatePower();

	if (config_game.vx >= 90 || config_game.vx <= 3) config_game.gravity = -config_game.gravity;


	if (config_game.isMoveArrow) requestAnimationFrame(animateArrow);
}

function animatePower() {

	config_game.powerBlocks.forEach(block => {
		if (block.classList.contains('_active')) block.classList.remove('_active');
	})

	let pin = 4;
	if (config_game.vx < 10) {
		pin = 4;
	} else if (config_game.vx >= 10 && config_game.vx < 25) {
		pin = 0;
	} else if (config_game.vx >= 25 && config_game.vx < 50) {
		pin = 1;
	} else if (config_game.vx >= 50 && config_game.vx < 75) {
		pin = 2;
	} else if (config_game.vx >= 75) {
		pin = 3;
	}

	config_game.powerBlocks.forEach(block => {
		if (pin === 0) {
			config_game.powerBlocks[0].classList.add('_active');
		} else if (pin === 1) {
			config_game.powerBlocks[0].classList.add('_active');
			config_game.powerBlocks[1].classList.add('_active');
		} else if (pin === 2) {
			config_game.powerBlocks[0].classList.add('_active');
			config_game.powerBlocks[1].classList.add('_active');
			config_game.powerBlocks[2].classList.add('_active');
		} else if (pin === 3) {
			config_game.powerBlocks[0].classList.add('_active');
			config_game.powerBlocks[1].classList.add('_active');
			config_game.powerBlocks[2].classList.add('_active');
			config_game.powerBlocks[3].classList.add('_active');
		}
	})

}

//==========

export function startGame() {
	holdButton();

	// Определили в какую корзину бросаем мяч
	getXPosForBall();

	// Генерируем случайный коеффициент для крайних корзин
	generateRandomCoeffs();

	// Выводим на экран текущий выигрышный коеффициент
	writeTargCoeffOnSCreen();

	// Создаем мяч в соответствующей корзине
	createBall();

	// Рассчитываем сколько выиграли
	checkWinCount();

}

function holdButton() {
	document.querySelector('.controls-game__button').classList.add('_hold');
}

function removeHoldButton() {
	document.querySelector('.controls-game__button').classList.remove('_hold');
}

function getXPosForBall() {
	if (config_game.vx < 10) {
		config_game.targetBlock = 0;
	} else if (config_game.vx >= 10 && config_game.vx < 20) {
		config_game.targetBlock = 1;
	} else if (config_game.vx >= 20 && config_game.vx < 30) {
		config_game.targetBlock = 2;
	} else if (config_game.vx >= 30 && config_game.vx < 40) {
		config_game.targetBlock = 3;
	} else if (config_game.vx >= 40 && config_game.vx < 50) {
		config_game.targetBlock = 4;
	} else if (config_game.vx >= 50 && config_game.vx < 60) {
		config_game.targetBlock = 5;
	} else if (config_game.vx >= 60 && config_game.vx < 70) {
		config_game.targetBlock = 6;
	} else if (config_game.vx >= 70 && config_game.vx < 85) {
		config_game.targetBlock = 7;
	} else if (config_game.vx >= 85 && config_game.vx < 100) {
		config_game.targetBlock = 8;
	}
}

function writeTargCoeffOnSCreen() {
	getCurrentWinCoeff();
	drawCurrentCoeff();
}

function getCurrentWinCoeff() {
	const currentItem = document.querySelectorAll('.container__item')[config_game.targetBlock];

	config_game.winCoeff = +currentItem.dataset.coeff;
}

function drawCurrentCoeff() {

	config_game.winCoeff >= 1 ?
		document.querySelector('.stake__coeff').textContent = `${config_game.winCoeff}.0` :
		document.querySelector('.stake__coeff').textContent = `${config_game.winCoeff}`

}

function createBall() {
	const currentItem = document.querySelectorAll('.container__item')[config_game.targetBlock];

	balls.balls.push(new Ball(balls.idx, currentItem, config_game.targetBlock));
	balls.idx++;

	balls.isBallMoving = true;
	animateBall();
}

function animateBall() {
	balls.balls.forEach(ball => {
		if (!ball.isStoped) {
			ball.update(balls.balls, balls.collide, balls.idx);
		}
	});


	if (balls.isBallMoving) requestAnimationFrame(animateBall);
	else {
		removeHoldButton();
		config_game.state = 1;
		// checkMuchBalls();

		removeBallsIfMuchCount();

		addMoney(config_game.winCount, '.score', 1000, 2000);
	}
}

function checkWinCount() {
	config_game.winCount = config_game.bet * config_game.winCoeff;
}

function removeBallsIfMuchCount() {
	const domBalls = document.querySelectorAll('.field__ball');

	checkIdxToREmove();

	if (balls.idxToDelete || balls.idxToDelete >= 0) {
		balls.balls.forEach((ball, i) => {
			if (ball.basket === balls.idxToDelete) {
				balls.balls.splice(i, 1);
			}
		})
		domBalls.forEach(ball => {
			if (ball.dataset.basket == balls.idxToDelete) {
				ball.remove();
			}
		})
	}
	balls.idxToDelete = null;

}

function checkIdxToREmove() {
	balls.balls.forEach(ball => {
		if (ball.y <= 10) {
			balls.idxToDelete = ball.basket;
		}
	})
}

function generateRandomCoeffs() {
	let arrCoeefs = [0, 0.1, 20, 0, 0.1, 0];

	let randNum = getRandom(0, 6);
	config_game.randCoeff = arrCoeefs[randNum];
	document.querySelector('[data-pos="1"]').setAttribute('data-coeff', arrCoeefs[randNum]);
	document.querySelector('[data-pos="9"]').setAttribute('data-coeff', arrCoeefs[randNum]);

}

class Ball {
	constructor(idx, item, basket) {
		// this.x = x;
		this.y = -100;
		this.item = item;

		this.width = 35;
		this.height = 35;

		this.idx = idx;
		this.basket = basket;
		this.skin = +sessionStorage.getItem('current-subject');

		this.vy = 0.5;
		this.vx = 3;
		this.gravity = 0.3;

		this.rotate = 0;

		this.rv = 0;

		this.ball = document.createElement('div');
		this.ball.classList.add('field__ball');
		this.ball.classList.add(`_${this.skin}`);
		this.ball.setAttribute('data-idx', this.idx);
		this.ball.setAttribute('data-basket', this.basket);

		this.draw();
	}

	draw() {
		this.ball.style.top = `${this.y}px`;
		// this.ball.style.left = `${this.x}px`;
		this.item.append(this.ball);
	}

	checkCollide(objectA, objectB) {
		if (objectA.basket === objectB.basket) { // проверяем, что мячи находятся в одной корзине
			const dx = (objectA.x + objectA.width / 2) - (objectB.x + objectB.width / 2);
			const dy = (objectA.y + objectA.height / 2) - (objectB.y + objectB.height / 2);
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance < objectA.width / 2 + objectB.width / 2) {
				return true;
			}
		}
		return false;
	}

	createDot(x, y) {
		let dot = document.createElement('div');
		dot.classList.add('_dot');
		document.querySelector('.game').append(dot);
		dot.style.top = `${y}px`;
		dot.style.left = `${x}px`;
	}

	update(ballsArr, collide) {

		// Записываем текущую координату мяча
		const yBall = this.ball.getBoundingClientRect().top;
		const xBall = this.ball.getBoundingClientRect().left;


		for (let i = 0; i < ballsArr.length; i++) {
			if (ballsArr[i].idx !== this.idx) {
				collide = this.checkCollide(ballsArr[i], this);

				if (collide) break;
			}
		}

		if (!collide) { // Если нет коллизии с мячом

			// Если просто вниз летим
			let item1 = document.elementFromPoint(xBall, yBall + this.height + 3);

			if (!item1.classList.contains('container__floor') && !item1.classList.contains('field__ball')) {

				this.vy += this.gravity;
				this.y += this.vy;

				this.ball.style.top = `${this.y}px`;

			} else if (item1.classList.contains('container__floor')) {

				balls.isBallMoving = false;
				config_game.state = 1;
				this.isStoped = true;
			} else if (item1.classList.contains('field__ball')) {
				balls.isBallMoving = false;
				config_game.state = 1;
				this.isStoped = true;
			}
		}


	}
}