export class Pacman {
    constructor(x, y, tileSize) {
        this.startX = x;
        this.startY = y;
        this.tileSize = tileSize;
        this.radius = tileSize / 2 - 2;
        this.speed = 100;
        this.reset();

        document.addEventListener('keydown', (e) => this.handleInput(e));
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.currentDir = { x: 0, y: 0 };
        this.nextDir = { x: 0, y: 0 };
        this.mouthOpen = 0;
        this.mouthSpeed = 10;
        this.mouthOpening = true;
    }

    handleInput(e) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.code) > -1) {
            e.preventDefault();
        }

        switch (e.code) {
            case 'ArrowUp': this.nextDir = { x: 0, y: -1 }; break;
            case 'ArrowDown': this.nextDir = { x: 0, y: 1 }; break;
            case 'ArrowLeft': this.nextDir = { x: -1, y: 0 }; break;
            case 'ArrowRight': this.nextDir = { x: 1, y: 0 }; break;
        }
    }

    update(deltaTime, maze) {
        if (this.nextDir.x !== 0 || this.nextDir.y !== 0) {
            if (this.canMove(this.x, this.y, this.nextDir, maze)) {
                this.currentDir = this.nextDir;
                this.nextDir = { x: 0, y: 0 };
            }
        }

        if (this.canMove(this.x, this.y, this.currentDir, maze)) {
            this.x += this.currentDir.x * this.speed * deltaTime;
            this.y += this.currentDir.y * this.speed * deltaTime;

            if (this.x < -this.tileSize) this.x = maze.map[0].length * this.tileSize;
            if (this.x > maze.map[0].length * this.tileSize) this.x = -this.tileSize;
        }

        if (this.mouthOpening) {
            this.mouthOpen += this.mouthSpeed * deltaTime;
            if (this.mouthOpen > 0.2) this.mouthOpening = false;
        } else {
            this.mouthOpen -= this.mouthSpeed * deltaTime;
            if (this.mouthOpen < 0) this.mouthOpening = true;
        }
    }

    canMove(x, y, dir, maze) {
        const nextX = x + dir.x * (this.tileSize / 2);
        const nextY = y + dir.y * (this.tileSize / 2);
        const centerX = nextX + this.tileSize / 2;
        const centerY = nextY + this.tileSize / 2;
        return !maze.isWall(centerX, centerY);
    }

    draw(ctx) {
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();

        const cx = this.x + this.tileSize / 2;
        const cy = this.y + this.tileSize / 2;

        let angle = 0;
        if (this.currentDir.x === 1) angle = 0;
        if (this.currentDir.x === -1) angle = Math.PI;
        if (this.currentDir.y === 1) angle = Math.PI / 2;
        if (this.currentDir.y === -1) angle = -Math.PI / 2;

        ctx.arc(cx, cy, this.radius, angle + this.mouthOpen * Math.PI, angle + (2 - this.mouthOpen) * Math.PI);
        ctx.lineTo(cx, cy);
        ctx.fill();
    }
}
