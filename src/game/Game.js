import { Maze } from './Maze.js';
import { Pacman } from './Pacman.js';
import { Ghost } from './Ghost.js';

export class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.lastTime = 0;

        this.canvas.width = 448;
        this.canvas.height = 496;

        this.maze = new Maze(this.ctx);
        this.pacman = new Pacman(14 * 16, 23 * 16, 16);

        this.ghosts = [
            new Ghost(13 * 16, 11 * 16, 16, 'red'),
            new Ghost(14 * 16, 11 * 16, 16, 'pink'),
            new Ghost(13 * 16, 13 * 16, 16, 'cyan'),
            new Ghost(14 * 16, 13 * 16, 16, 'orange')
        ];

        this.score = 0;
        this.isRunning = false;
    }

    start() {
        this.isRunning = true;
        this.lastTime = performance.now();
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
        console.log('Game Started');
    }

    gameLoop(timestamp) {
        if (!this.isRunning) return;

        const deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    update(deltaTime) {
        this.pacman.update(deltaTime, this.maze);
        this.ghosts.forEach(ghost => ghost.update(deltaTime, this.maze, this.pacman));

        // Check collisions with items
        const item = this.maze.checkCollision(this.pacman.x, this.pacman.y);
        if (item !== -1) {
            if (item === 0) {
                this.score += 10; // Cash
            } else if (item === 2) {
                this.score += 50; // BTC
            }
            document.getElementById('scoreValue').innerText = this.score;
        }

        // Check collisions with ghosts
        this.ghosts.forEach(ghost => {
            const dx = ghost.x - this.pacman.x;
            const dy = ghost.y - this.pacman.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 10) {
                this.gameOver();
            }
        });
    }

    draw() {
        this.ctx.fillStyle = '#1a0510';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.maze.draw();
        this.pacman.draw(this.ctx);
        this.ghosts.forEach(ghost => ghost.draw(this.ctx));
    }

    gameOver() {
        this.isRunning = false;
        document.getElementById('status').innerText = 'GAME OVER - PRESS SPACE';
        // Reset logic could be added here
    }
}
