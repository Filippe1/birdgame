// Global variables
let birdX, birdY, birdVelocity, gravity;
let birdFrames = [];
let frameIndex, frameTimer;
let pipes = [];
let score = 0;
let gameOver = false;
let baseY = 400;         // Top of the base (ground level)
let pipeWidth = 52;      // Width of the pipe image
let birdWidth = 34;      // Width of the bird image
let birdHeight = 24;     // Height of the bird image
let gapHeight = 100;     // Gap between top and bottom pipes
let pipeSpeed = 2;       // Speed at which pipes move left
let pipeImg, backgroundImg, baseImg;

// Pipe class to manage pipe pairs
class Pipe {
  constructor() {
    this.x = width;                          // Start at right edge
    this.pipeTopBottomY = random(100, 300);  // Bottom of top pipe
    this.pipeBottomTopY = this.pipeTopBottomY + gapHeight; // Top of bottom pipe
    this.scored = false;                     // Track if scored
  }
  
  move() {
    this.x -= pipeSpeed;                     // Move pipe left
  }
  
  display() {
    // Draw top pipe (flipped vertically)
    push();
    translate(this.x, this.pipeTopBottomY);
    scale(1, -1);
    image(pipeImg, -pipeWidth / 2, 0, pipeWidth, this.pipeTopBottomY);
    pop();
    
    // Draw bottom pipe
    image(pipeImg, this.x - pipeWidth / 2, this.pipeBottomTopY, pipeWidth, baseY - this.pipeBottomTopY);
  }
  
  offscreen() {
    return this.x < -pipeWidth;              // Check if pipe is offscreen
  }
}

// Load all images before the game starts
function preload() {
  // Load four bird frames for animation (replace with actual Imgur URLs)
  for (let i = 0; i < 4; i++) {
    birdFrames[i] = loadImage(`https://i.imgur.com/bird${i}.png`); // Placeholder URLs
  }
  
  // Load pipe, background, and base images from Flappy Bird Assets GitHub
  pipeImg = loadImage('https://raw.githubusercontent.com/samuelcust/flappy-bird-assets/master/sprites/pipe-green.png');
  backgroundImg = loadImage('https://raw.githubusercontent.com/samuelcust/flappy-bird-assets/master/sprites/background-day.png');
  baseImg = loadImage('https://raw.githubusercontent.com/samuelcust/flappy-bird-assets/master/sprites/base.png');
}

// Initialize the game
function setup() {
  createCanvas(288, 512);  // Standard Flappy Bird dimensions
  birdX = 50;              // Bird starts near the left
  birdY = height / 2;      // Bird starts in the middle vertically
  birdVelocity = 0;        // Initial vertical velocity
  gravity = 0.5;           // Gravity pulls bird down
  frameIndex = 0;          // Current animation frame
  frameTimer = 0;          // Timer for animation
}

// Main game loop
function draw() {
  // Draw background
  image(backgroundImg, 0, 0, width, height);
  
  if (!gameOver) {
    // Update bird position
    birdVelocity += gravity;
    birdY += birdVelocity;
    // Check collision with ground
    if (birdY > baseY - birdHeight / 2) {
      birdY = baseY - birdHeight / 2; // Stop at ground
      gameOver = true;
    }
    
    // Animate bird flapping
    frameTimer++;
    if (frameTimer >= 5) {           // Switch frames every 5 frames
      frameIndex = (frameIndex + 1) % 4;
      frameTimer = 0;
    }
    
    // Draw bird
    image(birdFrames[frameIndex], birdX - birdWidth / 2, birdY - birdHeight / 2, birdWidth, birdHeight);
    
    // Generate new pipes every 100 frames
    if (frameCount % 100 == 0) {
      pipes.push(new Pipe());
    }
    
    // Update and display pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].move();
      pipes[i].display();
      
      // Define rectangles for collision detection
      let birdRect = {x: birdX - birdWidth / 2, y: birdY - birdHeight / 2, w: birdWidth, h: birdHeight};
      let topPipeRect = {x: pipes[i].x - pipeWidth / 2, y: 0, w: pipeWidth, h: pipes[i].pipeTopBottomY};
      let bottomPipeRect = {x: pipes[i].x - pipeWidth / 2, y: pipes[i].pipeBottomTopY, w: pipeWidth, h: baseY - pipes[i].pipeBottomTopY};
      
      // Check for collisions with pipes
      if (rectOverlap(birdRect, topPipeRect) || rectOverlap(birdRect, bottomPipeRect)) {
        gameOver = true;
      }
      
      // Update score when bird passes pipe
      if (birdX > pipes[i].x && !pipes[i].scored) {
        pipes[i].scored = true;
        score++;
      }
      
      // Remove pipes that are offscreen
      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }
  } else {
    // Display game over screen
    textSize(32);
    textAlign(CENTER);
    fill(255);
    text("Game Over", width / 2, height / 2);
    text("Score: " + score, width / 2, height / 2 + 40);
  }
  
  // Draw base (ground)
  image(baseImg, 0, baseY, width, height - baseY);
  
  // Display current score
  textSize(24);
  textAlign(LEFT);
  fill(255);
  text("Score: " + score, 10, 30);
}

// Make bird flap on spacebar press
function keyPressed() {
  if (key === ' ' && !gameOver) {
    birdVelocity = -5;  // Upward velocity for flapping
  }
}

// Make bird flap on mouse click
function mousePressed() {
  if (!gameOver) {
    birdVelocity = -5;  // Upward velocity for flapping
  }
}

// Check if two rectangles overlap (for collision detection)
function rectOverlap(rect1, rect2) {
  return rect1.x < rect2.x + rect2.w &&
         rect1.x + rect1.w > rect2.x &&
         rect1.y < rect2.y + rect2.h &&
         rect1.y + rect1.h > rect2.y;
}
