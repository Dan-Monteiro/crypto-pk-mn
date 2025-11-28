import { Maze } from './Maze.js';
import { Pacman } from './Pacman.js';
import { Ghost } from './Ghost.js';
import { SoundManager } from './SoundManager.js';

export class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.lastTime = 0;

        this.canvas.width = 448;
        this.canvas.height = 496;

        this.maze = new Maze(this.ctx);
        this.pacman = new Pacman(14 * 16, 23 * 16, 16);
        this.sound = new SoundManager();

        this.ghosts = [
            new Ghost(13 * 16, 11 * 16, 16, 'red'),
            new Ghost(14 * 16, 11 * 16, 16, 'pink'),
            new Ghost(13 * 16, 13 * 16, 16, 'cyan'),
            new Ghost(14 * 16, 13 * 16, 16, 'orange')
        ];

        this.score = 0;
        this.level = 1;
        this.isRunning = false;
        this.isGameOver = false;

        this.draw();

        // We also add a one-time click listener to the BODY to ensure audio context starts
        // as soon as the user interacts with the page in any way.
        const startAudio = () => {
            if (this.sound.ctx.state === 'suspended') {
                this.sound.ctx.resume().then(() => {
                    this.sound.playLobbyMusic();
                });
            } else {
                this.sound.playLobbyMusic();
            }
        };
        document.addEventListener('click', startAudio, { once: true });
        document.addEventListener('keydown', startAudio, { once: true });
    }

    showLobby() {
        this.isRunning = false;
        this.isGameOver = false;
        this.fullReset();
        this.draw();
        document.getElementById('overlay').style.display = 'flex';
        document.getElementById('message').innerHTML = 'PRESS SPACE<br>TO START';
        this.sound.playLobbyMusic();
    }

    fullReset() {
        this.score = 0;
        this.level = 1;
        document.getElementById('scoreValue').innerText = 0;
        document.getElementById('levelValue').innerText = 1;
        this.maze.reset();
        this.pacman.reset();
        // Reset ghosts to initial 4
        this.ghosts = [
            new Ghost(13 * 16, 11 * 16, 16, 'red'),
            new Ghost(14 * 16, 11 * 16, 16, 'pink'),
            new Ghost(13 * 16, 13 * 16, 16, 'cyan'),
            new Ghost(14 * 16, 13 * 16, 16, 'orange')
        ];
    }

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.isGameOver = false;
        document.getElementById('overlay').style.display = 'none'; // Hide overlay

        this.lastTime = performance.now();
        this.sound.playGameMusic(); // Switch to game music
        this.sound.playStart();
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
        console.log('Game Started');
    }

    gameLoop(timestamp) {
        if (!this.isRunning) return;

        // Cap deltaTime to prevent huge jumps (max 0.1s)
        let deltaTime = (timestamp - this.lastTime) / 1000;
        if (deltaTime > 0.1) deltaTime = 0.1;

        this.lastTime = timestamp;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    update(deltaTime) {
        this.pacman.update(deltaTime, this.maze);
        this.ghosts.forEach(ghost => ghost.update(deltaTime, this.maze, this.pacman));

        const item = this.maze.checkCollision(this.pacman.x, this.pacman.y);
        if (item !== -1) {
            if (item === 0) {
                this.score += 10;
                this.sound.playEat();
            } else if (item === 2) {
                this.score += 50;
                this.sound.playPower();
            }
            document.getElementById('scoreValue').innerText = this.score;

            // Check Level Complete
            if (this.maze.itemsRemaining === 0) {
                this.nextLevel();
            }
        }

        this.ghosts.forEach(ghost => {
            const dx = ghost.x - this.pacman.x;
            const dy = ghost.y - this.pacman.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 10) {
                this.gameOver();
            }
        });
    }

    nextLevel() {
        this.level++;
        document.getElementById('levelValue').innerText = this.level;
        this.sound.playLevelUp();

        this.maze.reset();
        this.pacman.reset();
        this.ghosts.forEach(g => g.reset());

        // Add new ghost
        const colors = ['purple', 'green', 'yellow', 'white'];
        const color = colors[(this.level - 2) % colors.length];
        // Spawn in ghost house
        this.ghosts.push(new Ghost(13 * 16, 14 * 16, 16, color));

        // Pause briefly? For now just continue
        this.isRunning = false;
        setTimeout(() => {
            this.isRunning = true;
            this.lastTime = performance.now();
            requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
        }, 2000);
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
        this.isGameOver = true;
        this.sound.playDie();
        setTimeout(() => this.sound.playGameOverMusic(), 1000); // Start tense game over music after death sound

        document.getElementById('overlay').style.display = 'flex';
        document.getElementById('message').innerHTML = 'GAME OVER<br><span style="font-size:20px">PRESS ANY KEY</span>';
    }
}
