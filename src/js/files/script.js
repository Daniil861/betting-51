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
	document.querySelectorAll('[data-shop-button]').forEach(btn => {
		if (btn.closest('._bought')) {
			btn.innerHTML = `<span>Select</span>`;
		}
	})

	if (+sessionStorage.getItem('current-subject') === 1) {
		document.querySelector('[data-shop-button="1"]').innerHTML = `<span>Selected</span>`;
		document.querySelector('[data-subject="1"]').classList.add('_selected');
	} else if (+sessionStorage.getItem('current-subject') === 2) {
		document.querySelector('[data-shop-button="2"]').innerHTML = `<span>Selected</span>`;
		document.querySelector('[data-subject="2"]').classList.add('_selected');
	} else if (+sessionStorage.getItem('current-subject') === 3) {
		document.querySelector('[data-shop-button="3"]').innerHTML = `<span>Selected</span>`;
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
//game
export const config_game = {
	state: 1, // 1 - не играем, 2 - выбор силы удара (бегает стрелка), 3 - запускаем мяч
	strong: 0,

	// arrow
	arrow: document.querySelector('.footer-field__arrow'),
	isMoveArrow: false,
	vy: 16, // 16
	vx: 35, // 16
	gravity: 5, // -5

	winCoeff: 1,

	fps: 70,
	timer: 0,
	interval: 1000 / 70,
}

const balls = {
	balls: [],
	isBallMoving: false,
	idx: 0,
	collide: {
		bit: false,
		turn: null
	},

	wallLeft: document.querySelector('[data-wall="1"]'),
	wallRight: document.querySelector('[data-wall="2"]'),
	wallBottom: document.querySelector('[data-wall="3"]'),
	wallLeftCenter: document.querySelector('[data-wall="4"]'),
	wallRightCenter: document.querySelector('[data-wall="5"]'),
}

export function startSelectStrong() {

	document.querySelector('.bet-box').classList.add('_hold');
	document.querySelector('.footer-field__button').classList.add('_hold');

	// Делаем метку что стрелка активна
	config_game.isMoveArrow = true;

	// Делаем метку что состояние игры в режиме выбора силы удара
	config_game.state = 2;

	deleteMoney(+sessionStorage.getItem('current-bet'), '.score');

	animateArrow();
}

function finishRound() {
	document.querySelector('.bet-box').classList.remove('_hold');
	document.querySelector('.footer-field__button').classList.remove('_hold');
}


function animateArrow() {

	config_game.vx += config_game.gravity;

	config_game.arrow.style.left = `${config_game.vx}%`;

	if (config_game.vx >= 90 || config_game.vx <= 3) config_game.gravity = -config_game.gravity;


	if (config_game.isMoveArrow) requestAnimationFrame(animateArrow);
}


export function showFinalScreen() {
	const final = document.querySelector('.final');
	const finalCheck = document.querySelector('.final-check');
	const bet = +sessionStorage.getItem('current-bet');

	finalCheck.textContent = config_game.winCoeff * bet;

	setTimeout(() => {
		final.classList.add('_visible');
	}, 150);
}

function checkBet() {
	const bet = +sessionStorage.getItem('current-bet');
	// < 12% - 1
	// > 12 && < 30 - 2
	// >30 && < 60 - 5
	// > 60 && < 75 - 2
	// > 75 && < 90 - 1
	if (config_game.vx < 12 || config_game.vx > 75) {
		config_game.winCoeff = 1;
	} else if ((config_game.vx >= 12 && config_game.vx < 30) || (config_game.vx > 60 && config_game.vx <= 75)) {
		config_game.winCoeff = 2;
	} else if (config_game.vx >= 30 && config_game.vx < 60) {
		config_game.winCoeff = 5;
	}
	addMoney(config_game.winCoeff * bet, '.score', 1000, 2000);
}

export function shootBall() {
	const frameWidth = document.querySelector('.field__frame').clientWidth;

	balls.balls.push(new Ball((config_game.vx / 100) * frameWidth, balls.idx));
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
		finishRound();
		checkMuchBalls();
		checkBet();
	}
}

class Ball {
	constructor(x, idx) {
		this.x = x;
		this.y = -100;
		this.width = 35;
		this.height = 35;
		this.idx = idx;
		this.skin = +sessionStorage.getItem('current-subject');

		this.vy = 0.5;
		this.vx = 3;
		this.gravity = 0.5;

		this.rotate = 0;

		this.rv = 0;

		this.ball = document.createElement('div');
		this.ball.classList.add('field__ball');
		this.ball.classList.add(`_${this.skin}`);
		this.ball.setAttribute('data-idx', this.idx);

		this.draw();
	}

	draw() {
		this.ball.style.top = `${this.y}px`;
		this.ball.style.left = `${this.x}px`;
		document.querySelector('.field__balls').append(this.ball);
	}

	checkCollide(objectA, objectB) {
		const dx = (objectA.x + objectA.width / 2) - (objectB.x + objectB.width / 2);
		const dy = (objectA.y + objectA.height / 2) - (objectB.y + objectB.height / 2);
		const distance = Math.sqrt(dx * dx + dy * dy);

		if (distance < objectA.width / 2 + objectB.width / 2) {

			let turn = objectA.x > objectB.x ? 'left' : 'right';

			return {
				bit: true,
				turn
			};
		} else {
			return {
				bit: false,
				turn: null
			};
		}
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
		const xBall = this.ball.getBoundingClientRect().left;
		const yBall = this.ball.getBoundingClientRect().top;

		const ballBottom = this.ball.getBoundingClientRect().top + this.height;

		// Записываем что находится слева или справа от мяча
		let sbjLeftBall = document.elementFromPoint(xBall - 3, yBall + this.height);
		let sbjRightBall = document.elementFromPoint(xBall + this.width + 3, yBall + this.height);


		let leftWallCol = false;
		let rightWallCol = false;
		let centerLeftWallRightCol = false;
		let centerLeftWallLeftCol = false;

		// Проверяем, есть ли коллизия с левой стеной
		if (sbjLeftBall && sbjLeftBall.getAttribute('data-wall') && sbjLeftBall.getAttribute('data-wall') == 1) {
			leftWallCol = true;
			// this.createDot(xBall - 3, yBall + this.height);
		}

		// Проверяем, есть ли коллизия с правой стеной
		if (sbjRightBall && sbjRightBall.getAttribute('data-wall') && sbjRightBall.getAttribute('data-wall') == 2) {
			rightWallCol = true;
			// this.createDot(xBall + this.width + 3, yBall + this.height);
		}

		// Проверяем, есть ли стена (центральная левая) справа от мяча
		if (sbjRightBall && sbjRightBall.getAttribute('data-wall') && sbjRightBall.getAttribute('data-wall') == 4) {
			centerLeftWallRightCol = true;
			// this.createDot(xBall + this.width + 3, yBall + this.height);
		}

		// Проверяем, есть ли стена (центральная левая) слева от мяча
		if (sbjLeftBall && sbjLeftBall.getAttribute('data-wall') && sbjLeftBall.getAttribute('data-wall') == 4) {
			centerLeftWallLeftCol = true;
			// this.createDot(xBall - 3, yBall + this.height);
		}

		// Проверяем, есть ли стена (центральная правая) справа от мяча
		if (sbjRightBall && sbjRightBall.getAttribute('data-wall') && sbjRightBall.getAttribute('data-wall') == 5) {
			centerLeftWallRightCol = true;
			// this.createDot(xBall + this.width + 3, yBall + this.height);
		}

		// Проверяем, есть ли стена (центральная правая) слева от мяча
		if (sbjLeftBall && sbjLeftBall.getAttribute('data-wall') && sbjLeftBall.getAttribute('data-wall') == 5) {
			centerLeftWallLeftCol = true;
			// this.createDot(xBall - 3, yBall + this.height);
		}

		const bottomWall = balls.wallBottom.getBoundingClientRect().top;

		for (let i = 0; i < ballsArr.length; i++) {
			if (ballsArr[i].idx !== this.idx) {
				collide = {
					...this.checkCollide(ballsArr[i], this)
				}

				if (collide.bit) break;
			}
		}

		if (!collide.bit) { // Если нет коллизии с мячом

			// Если есть коллизия с левой стеной (мы катямся вниз по этой стене)
			if (leftWallCol) {

				// Получаем по координатам элемент,который находится справа от мяча
				let rightItem = document.elementFromPoint(xBall + this.width + 3, yBall + this.height - 3);

				// Если этот элемент является другим мячом, тогда останавливаем текущий мяч
				if (rightItem.classList.contains('field__ball')) {
					balls.isBallMoving = false;
					config_game.state = 1;
					this.isStoped = true;
				} else { // В обратном случае продолжаем движение
					this.x += this.vx;
					this.ball.style.left = `${this.x}px`;

					this.rotate += this.rv;
					this.ball.style.transform = `rotate(${this.rotate}deg)`;
				}
			}

			// Если есть коллизия с правой стеной (мы катямся вниз по этой стене)
			else if (rightWallCol) {

				// Получаем по координатам элемент,который находится слева от мяча
				let leftItem = document.elementFromPoint(xBall - 3, yBall + this.height - 3);

				// Если этот элемент является другим мячом, тогда останавливаем текущий мяч
				if (leftItem.classList.contains('field__ball')) {
					balls.isBallMoving = false;
					config_game.state = 1;
					this.isStoped = true;
				} else { // В обратном случае продолжаем движение
					this.x -= this.vx;
					this.ball.style.left = `${this.x}px`;

					this.rotate -= this.rv;
					this.ball.style.transform = `rotate(${this.rotate}deg)`;
				}
			}

			// если мяч касается одной из центральных стен правым краем
			else if (centerLeftWallRightCol) {

				// Получаем по координатам элемент,который находится слева от мяча
				let item = document.elementFromPoint(xBall - 10, yBall + this.height - 3);

				// Если этот элемент является другим мячом или стеной, тогда останавливаем текущий мяч
				if (item.classList.contains('field__ball') && item.getAttribute('data-idx') != this.idx) {

					balls.isBallMoving = false;
					config_game.state = 1;
					this.isStoped = true;
				} else { // В обратном случае продолжаем движение
					this.x -= this.vx;
					this.ball.style.left = `${this.x}px`;

					this.rotate -= this.rv;
					this.ball.style.transform = `rotate(${this.rotate}deg)`;
				}
			}

			// если мяч касается стены левым краем
			else if (centerLeftWallLeftCol) {

				// Получаем по координатам элемент,который находится справа от мяча
				let item = document.elementFromPoint(xBall + this.width + 5, yBall + this.height - 3);

				// Если этот элемент является другим мячом или стеной, тогда останавливаем текущий мяч
				if (item.classList.contains('field__ball') && item.getAttribute('data-idx') != this.idx) {

					balls.isBallMoving = false;
					config_game.state = 1;
					this.isStoped = true;
				} else {
					this.x += this.vx;
					this.ball.style.left = `${this.x}px`;

					this.rotate += this.rv;
					this.ball.style.transform = `rotate(${this.rotate}deg)`;
				}
			}

			// Если просто вниз летим
			else if (ballBottom < bottomWall && !collide.bit) {
				console.log(collide.bit);
				// Получаем по координатам элемент,который находится снизу от мяча
				let item1 = document.elementFromPoint(xBall + this.width * 0.5, yBall + this.height + 3);
				let item2 = document.elementFromPoint(xBall - 3, yBall + this.height + 3);
				let item3 = document.elementFromPoint(xBall + this.width + 3, yBall + this.height + 3);

				console.log(item1.dataset.wall);
				if (item1.dataset.wall && item1.dataset.wall != 3 && !item2.dataset.wall && !item3.dataset.wall) {
					this.x -= this.vx;
					this.ball.style.left = `${this.x}px`;

					this.rotate -= this.rv;
					this.ball.style.transform = `rotate(${this.rotate}deg)`;
				} else {
					console.log('Летим ровно вниз');
					this.vy += this.gravity;
					this.y += this.vy;

					this.ball.style.top = `${this.y}px`;
				}

			} else {
				balls.isBallMoving = false;
				config_game.state = 1;
				this.isStoped = true;
			}
		} else {// Если есть коллизия

			// Если мяч не достиг нижней стены
			if (ballBottom < bottomWall) {
				// Если сторона, в которую двигается мяч - левая
				if (collide.turn === 'left') {
					console.log('Collision and move LEFT');
					let leftItem = document.elementFromPoint(xBall - 3, yBall + this.height - 3);
					let semiLeftItem = document.elementFromPoint(xBall + this.width * 0.5, yBall + this.height + 7);
					let startLeftItem = document.elementFromPoint(xBall + this.width * 0.1, yBall + this.height + 7);
					console.log(leftItem);
					console.log(semiLeftItem);
					console.log(startLeftItem);
					// Если слева есть мяч или стена - останавливаемся
					if (leftItem.classList.contains('field__ball') ||
						leftItem.closest('.field__wall') ||
						semiLeftItem.closest('.field__wall') ||
						startLeftItem.closest('.field__wall')
					) {

						balls.isBallMoving = false;
						config_game.state = 1;
						this.isStoped = true;
					} else {
						this.x -= this.vx;
						this.ball.style.left = `${this.x}px`;

						this.rotate -= this.rv;
						this.ball.style.transform = `rotate(${this.rotate}deg)`;
					}

				}
				else {
					console.log('Collision and move right');

					let rightItem = document.elementFromPoint(xBall + this.width + 3, yBall + this.height - 3);
					let semiRightItem = document.elementFromPoint(xBall + this.width * 0.5, yBall + this.height + 7);
					let startRightItem = document.elementFromPoint(xBall + this.width * 0.1, yBall + this.height + 7);

					console.log(rightItem);
					console.log(semiRightItem);
					console.log(startRightItem);

					if (rightItem.classList.contains('field__ball') ||
						rightItem.closest('.field__wall') ||
						semiRightItem.closest('.field__wall') ||
						startRightItem.closest('.field__wall')
					) {
						balls.isBallMoving = false;
						config_game.state = 1;
						this.isStoped = true;
					} else {
						this.x += this.vx;
						this.ball.style.left = `${this.x}px`;

						this.rotate += this.rv;
						this.ball.style.transform = `rotate(${this.rotate}deg)`;
					}
				}
			} else { // Если мяч достиг нижней стены
				balls.isBallMoving = false;
				config_game.state = 1;
				this.isStoped = true;
			}
		}

	}
}

function checkMuchBalls() {
	const balls2 = document.querySelectorAll('.field__ball');
	balls2.forEach(ball => {
		const style = window.getComputedStyle(ball);
		let top = parseInt(style.top, 10);

		if (top < 0) {
			if (!document.querySelector('.final').classList.contains('_visible')) {
				showFinalScreen();
				setTimeout(() => {
					balls2.forEach(ball => ball.remove());

					balls.balls.splice(0, balls.balls.length);
				}, 500);
			} else {
				balls2.forEach(ball => ball.remove());

				balls.balls.splice(0, balls.balls.length);
			}
		}
	})
}
