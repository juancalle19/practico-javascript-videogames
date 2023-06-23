
const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

//buttons
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');

//lives
const spanLives = document.querySelector('#lives');

//time
const spantime = document.querySelector('#time');

//record & result
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;
let timeStart;
let timePlayer;
let timeInterval;


//Jugador
const playerPosition = {
    x: undefined,
    y: undefined
};

//posicion regalo
const giftPosition = {
    x: undefined,
    y: undefined
}

let enemyPositions = []

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize)

function setCanvasSize() {
    
    if (window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.8;
    }else {
        canvasSize = window.innerHeight * 0.8;
    }

    canvasSize = Number(canvasSize.toFixed(0));

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementsSize = canvasSize / 10;

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function startGame() {
    
    console.log(canvasSize , elementsSize);

    game.font = elementsSize +'px Verdana';
    game.textAlign = 'end';

    const map = maps[level];

    if (!map) {
        gameWin();
        return;
    }

    if (!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
    }
    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map((row) => {return row.trim().split('')});
    console.log({map, mapRows,mapRowCols});

    showLives();

    enemyPositions = [];
    game.clearRect(0, 0, canvasSize, canvasSize);
    console.group();
    mapRowCols.forEach( (row, rowI) => {
        row.forEach( (col, colI) => {
            const emoji = emojis[col];
            const posX = elementsSize * (colI + 1);
            const posY = elementsSize * (rowI + 1);

            //ubicar Player
            if (col == 'O') {
                if(!playerPosition.x && !playerPosition.y){
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                    console.log({playerPosition});
                }
                
            }else if (col == 'I'){
                giftPosition.x = posX;
                giftPosition.y = posY;
            }else if(col == 'X'){
                enemyPositions.push({
                    x: posX,
                    y: posY
                })
            }

            game.fillText(emoji, posX, posY);
            //console.log({row,rowI,col,colI,emoji})
        })
    });

    movePlayer();
}

window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp );
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function movePlayer() {
    const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
    const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    const giftCollision = giftCollisionX && giftCollisionY;

    if (giftCollision) {
        console.log('Subiste de nivel');
        levelWin();
    }

    const enemyCollision = enemyPositions.find(enemy => {
        const enemyCollisonX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
        const enemyCollisonY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
        return enemyCollisonX && enemyCollisonY;
    });

    if (enemyCollision) {
        levelFail();
        console.log('boom!'); 
    }

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
    console.groupEnd();
}

function levelWin() {
    level++;
    startGame();
}

function levelFail() {
    lives--;

    if (lives <=0) {
        level = 0;
        lives = 3;
        timeStart = undefined;
    }

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function gameWin() {
    console.log('Terminaste el juego');
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = Date.now() - timeStart;

    if (recordTime) {
        if (recordTime >= playerTime) {
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML = 'Record superado';
        }else {
            pResult.innerHTML = 'Record No superado';
        }
    }else{
        localStorage.setItem('record_time', playerTime);
    }
}

function showLives() {
    const heartArray = Array(lives).fill(emojis['HEART']);
    //console.log(heartArray);
    spanLives.innerHTML = '';
    heartArray.forEach((heart) => {spanLives.append(heart)});
}

function showTime() {
    spantime.innerHTML = Date.now() - timeStart;
}

function showRecord() {
    spanRecord.innerHTML = localStorage.getItem('record_time');
}

function moveByKeys(event) {
    console.log(event);
    switch (event.key) {
        case 'ArrowUp':
            moveUp();
            break;
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
        case 'ArrowDown':
            moveDown();
            break;
        default:
            break;
    }
}

function moveUp() {
    console.log('arriba');

    if ((playerPosition.y - elementsSize) < elementsSize) console.log('out');
    else
        playerPosition.y -= elementsSize;
        startGame();
}

function moveLeft() {
    console.log('izquierda');
    if ((playerPosition.x - elementsSize) < elementsSize) console.log('out');
    else
        playerPosition.x -= elementsSize;
        startGame();
    
}

function moveRight() {
    console.log('derecha');
    if ((playerPosition.x + elementsSize) > canvasSize) console.log('out');
    else
        playerPosition.x += elementsSize;
        startGame();
}

function moveDown() {
    console.log('abajo');
    if ((playerPosition.y + elementsSize) > canvasSize) console.log('out');
    else
        playerPosition.y += elementsSize;
        startGame();
    
}
