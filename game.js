class Road {
	constructor(image, y) {
		this.x = 0;
		this.y = y;
		this.loaded = false;

		this.image = new Image();

		let obj = this;

		this.image.addEventListener("load", function () {
			obj.loaded = true;
		});

		this.image.src = image;
	}

	Update(road) {
		this.y += speed; //движение изображения вниз с каждым кадром

		if (this.y > window.innerHeight) //если изображение покинуло экран, оно изменит свое положение
		{
			this.y = road.y - canvas.width + speed; //Новая позиция зависит от второго дорожного объекта
		}
	}
}

class Car {
	constructor(image, x, y, isPlayer) {
		this.x = x;
		this.y = y;
		this.loaded = false;
		this.dead = false;
		this.isPlayer = isPlayer;

		this.image = new Image();

		let obj = this;

		this.image.addEventListener("load", function () {
			obj.loaded = true;
		});

		this.image.src = image;
	}

	Update() {
		if (!this.isPlayer) {
			this.y += speed;
		}

		if (this.y > canvas.height + 50) {
			this.dead = true;
		}
	}

	Collide(car) {
		let hit = false;

		if (this.y < car.y + car.image.height * scale && this.y + this.image.height * scale > car.y) //Если произойдет столкновение по y
		{
			if (this.x + this.image.width * scale > car.x && this.x < car.x + car.image.width * scale) //Если есть столкновение по x
			{
				hit = true;
			}
		}

		return hit;
	}

	Move(v, d) {
		if (v == "x") //Движение по х
		{
			d *= 2;

			this.x += d; // меняем позицию по х

			//Откат изменений, если автомобиль покинул экран
			if (this.x + this.image.width * scale > canvas.width) {
				this.x -= d;
			}

			if (this.x < 0) {
				this.x = 0;
			}
		} else //Движение по  y // аналогично
		{
			this.y += d;

			if (this.y + this.image.height * scale > canvas.height) {
				this.y -= d;
			}

			if (this.y < 0) {
				this.y = 0;
			}
		}

	}
}
// Получаем лучший результат
if (!localStorage.getItem('bestScope')) localStorage.setItem('bestScope', 0);
let bestScope = localStorage.getItem('bestScope');

let mouse = {x: 0, y: 0}; // позиция мыши на канве для правильной точки старта

// Начало игры
let formStart = document.querySelector('.formStart')
btnStartGame = formStart.querySelector('#startGame'),
	userName = 'user',
	pulseCounter = document.querySelector('.counter-wrapper'),
	startCounter = 3,
	scope = 0;

btnStartGame.addEventListener("click", function (e) {
	
	e.preventDefault()
	pulseCounter.classList.remove('hide');
	userName = formStart.querySelector('#userName').value;
	formStart.classList.add('hide');
	let timerId = setInterval(() => {
		pulseCounter.querySelector('.cont').textContent = --startCounter;
	}, 1000);
	setTimeout(() => { // Старта после красивого счетчика
		clearInterval(timerId);
		pulseCounter.classList.add('hide');
		player.x = mouse.x;
		player.y = mouse.y;
		Start();

	}, 3000);
})

// конец / пауза игры
let stopWindow = document.querySelector('.stopWindow'),
	btnRestart = stopWindow.querySelector('#btn-restart'),
	btnPause = stopWindow.querySelector('#btn-pause'),
	btnNull = stopWindow.querySelector('#btn-null'),
	userLose = stopWindow.querySelector('.userlose'),
	userStop = stopWindow.querySelector('.userstop'),
	stopTitle = stopWindow.querySelector('.stop-title');

	// рестарт
btnRestart.addEventListener('click', () => {
	btnPause.classList.remove('hide')
	stopWindow.classList.add('hide');
	player.x = mouse.x;
	player.y = mouse.y;
	player.dead = false;
	objects = [];
	scope = 0;
	speed = 3;
	Resize();
	Start();

})

// пауза - продолжение
btnPause.addEventListener('click', () => {
	stopWindow.classList.add('hide');
	Start();
})
// обнуление
btnNull.addEventListener('click', () => {
	localStorage.setItem('bestScope', 0);
	bestScope = 0;
	btnPause.classList.remove('hide')
	stopWindow.classList.add('hide');
	player.x = mouse.x;
	player.y = mouse.y;
	player.dead = false;
	objects = [];
	scope = 0;
	speed = 3;
	Resize();
	Start();
})

// логика игры
let speed = 3; // начальная срокость

let UPDATE_TIME = 1000 / 60;

let timer = null;

let canvas = document.getElementById("canvas"); 
let ctx = canvas.getContext("2d"); 

let player = new Car("images/car1.png", canvas.width / 2, (canvas.height - 300), true); // игрок
let scale = .3; //приближение к машине - определяет размер

Resize();

window.addEventListener("resize", Resize);

canvas.addEventListener("contextmenu", function (e) {
	e.preventDefault();
	return false;
});

window.addEventListener("keydown", function (e) {
	KeyDown(e);
}); //нажатие на кнопки на канве
window.addEventListener("mousemove", function (e) {
	MouseMove(e);
}); // движение мышки по канве

let objects = []; //другие машины

let roads = [
	new Road("images/road2.jpg", 0),
	new Road("images/road2.jpg", canvas.width)
]; //дорожное покрытие




function Start() {
	if (!player.dead) {
		timer = setInterval(Update, UPDATE_TIME); 
		stopWindow.classList.add('hide');
	}

}

function Stop() {
	clearInterval(timer); //остановка интервалов - игры
	timer = null;
	stopWindow.classList.remove('hide');
	if (player.dead) {
		userStop.classList.add('hide')
		userLose.classList.remove('hide');

		if (scope > bestScope) {
			localStorage.setItem('bestScope', scope);
			bestScope = scope;
			stopTitle.textContent = "Новый рекорд"

			userLose.innerHTML = `${userName}, у тебя новый рекорд! Трибуны ревут от твоей мощи!<br> Твой счет за эту игру: ${scope}`;
		} else {
			stopTitle.textContent = "Игра окончена"
			userLose.innerHTML = `Спасибо за потрясающую игру, ${userName}! Похоже, ты профи!<br> Твой счет за эту игру: ${scope}. Рекорд за все время: ${bestScope}`;
		}
	} else {
		stopTitle.textContent = "Игра на паузе"
		userStop.classList.remove('hide')
		userLose.classList.add('hide')
		userStop.innerHTML = `${userName}, ты прекрасно справляешься! Cкорее возвращайся и победи в гонке! <br> Твой текущий счет: ${scope}`
	}
}
let numCar = 1; // для выбора цвета машины

function Update() {
	roads[0].Update(roads[1]);
	roads[1].Update(roads[0]);

	if ((Math.random() * (79 + speed)) > 80) //генерация машины - в целом, почти рандомная
	{
		objects.push(new Car("images/car-" + numCar + ".png", RandomInteger(30, canvas.width - 50), RandomInteger(250, 600) * -1, false));
		// с рандомной позицией
	}
	++numCar; // меняем цвет машины
	if (numCar > 3) numCar = 1;

	player.Update();

	// проверка на неактуальность машины - если она вне канвы - удаляем
	if (player.dead)
		Stop();

	let isDead = false;

	for (let i = 0; i < objects.length; i++) {
		objects[i].Update();

		if (objects[i].dead) {
			isDead = true;
		}
	}

	if (isDead) {
		objects.shift();
	}

	let hit = false;

	// проверка столкновений
	for (let i = 0; i < objects.length; i++) {
		hit = player.Collide(objects[i]);

		if (hit) {
			player.dead = true;
			Stop();
			btnPause.classList.add('hide')
			break;
		}
	}

	Draw();
}

function Draw() // отрисовочка всего на канве
{
	ctx.clearRect(0, 0, canvas.width, canvas.height); 

	for (let i = 0; i < roads.length; i++) {
		ctx.drawImage(
			roads[i].image, //картинка
			0, //позиция х картинки
			0, //позиция у картинки
			roads[i].image.width, 
			roads[i].image.height, 
			roads[i].x, 
			roads[i].y,
			canvas.width,
			canvas.width
		);
	}

	DrawCar(player); // рисуем игрока

	for (let i = 0; i < objects.length; i++) { // другие машины
		DrawCar(objects[i]);
	}

	ctx.beginPath();
	ctx.fillStyle = "rgba(67, 67, 67, 0.402)";
	ctx.rect(0, 0, canvas.width, 60);
	ctx.fill();
	scope += 1;
	ctx.font = '30px Consolas';
	ctx.fillStyle = "#fff";
	ctx.fillText(userName, 80, 40);
	ctx.fillText("Счет: " + scope, (canvas.width - 250), 40);

	// повышение скорости игры
	if (scope % 500 == 0) {
		speed += 0.5;
	}
}

function DrawCar(car) {
	ctx.drawImage(
		car.image,
		0,
		0,
		car.image.width,
		car.image.height,
		car.x,
		car.y,
		car.image.width * scale,
		car.image.height * scale
	);
}

function KeyDown(e) {
	switch (e.keyCode) {
		case 27: //esc
			if (timer == null) {
				Start();
			} else {
				Stop();
			}
			break;
		case 32: //space - пробел
			speed += 0.5;
	}
}

function MouseMove(e) {
	
	player.Move("x", e.movementX / 3);
	player.Move("y", e.movementY / 2);

	if (timer == null) {
		mouse.x = e.clientX;
		mouse.y = e.clientY;
	}
}

function Resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function RandomInteger(min, max) {
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}