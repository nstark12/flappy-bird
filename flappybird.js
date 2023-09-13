// board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// dog
let dogWidth = 34;
let dogHeight = 38;
let dogX = boardWidth/8;
let dogY = boardHeight/2;
let dogImg;

let dog = {
    x : dogX,
    y : dogY,
    width: dogWidth,
    height: dogHeight
}

// pipes
let pipeArray = [];
let pipeWidth = 64; // width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// game physics
let velocityX = -2; // pipes moving left speed
let velocityY = 0; // dog jump speed if 0, not jumping at all
let gravity = 0.4;

let gameOver = false;
let score = 0;


window.onload = function() {
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext('2d'); //used for drawing on the board

    // load images
    dogImg = new Image();
    dogImg.src = './loona.png';
    dogImg.onload = function() {
        context.drawImage(dogImg, dog.x, dog.y, dog.width, dog.height);
    }
    
    topPipeImg = new Image();
    topPipeImg.src = './toppipe.png';

    bottomPipeImg = new Image();
    bottomPipeImg.src = './bottompipe.png';

    requestAnimationFrame(update);
    setInterval(placePipes, 1500); // places pipes every 1500 ms or 1.5 seconds
    document.addEventListener('keydown', moveDog);
    
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    // clears previous frame
    context.clearRect(0, 0, board.width, board.height);

    // dog
    velocityY += gravity;
    dog.y = Math.max(dog.y + velocityY, 0); // apply gravity to current dog.y, limit the dog.y to top of canvas
    context.drawImage(dogImg, dog.x, dog.y, dog.width, dog.height);

    if (dog.y > board.height) {
        gameOver = true;
    }

    // pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && dog.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(dog, pipe)) {
            gameOver = true;
        }
    }

    // clear pipes
    while (pipeArray.lenght > 0 && pipeArray[0].x < -pipeWidth) { //-pipeWidth is the right side of the pipe
        pipeArray.shift(); // removes first element from the array
    }

    // score
    context.fillStyle = 'white';
    context.font = '45px sans-serif';
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText('GAME OVER', 5, 90);
    }
}

function placePipes() {
    if (gameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height: pipeHeight,
        passed : false // sees if flappy dog has passed this pipe yet
    }

    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed: false
    }

    pipeArray.push(bottomPipe);
}

function moveDog(e) {
    if (e.code == 'Space' || e.code == 'ArrowUp') {
        // jump
        velocityY = -6;

        // reset game
        if (gameOver) {
            dog.y = dogY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}