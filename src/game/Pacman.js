export class Pacman {
    constructor(x, y, tileSize) {
        this.x = x;
        this.y = y;
        this.tileSize = tileSize;
        this.radius = tileSize / 2 - 2;
        this.speed = 100; // pixels per second

        this.currentDir = { x: 0, y: 0 };
        this.nextDir = { x: 0, y: 0 };

        this.mouthOpen = 0;
        this.mouthSpeed = 10;
        this.mouthOpening = true;

        document.addEventListener('keydown', (e) => this.handleInput(e));
    }

    handleInput(e) {
        switch (e.code) {
            case 'ArrowUp': this.nextDir = { x: 0, y: -1 }; break;
            case 'ArrowDown': this.nextDir = { x: 0, y: 1 }; break;
            case 'ArrowLeft': this.nextDir = { x: -1, y: 0 }; break;
            case 'ArrowRight': this.nextDir = { x: 1, y: 0 }; break;
        }
    }

    update(deltaTime, maze) {
        // Try to change direction if aligned with grid
        if (this.nextDir.x !== 0 || this.nextDir.y !== 0) {
            if (this.canMove(this.x, this.y, this.nextDir, maze)) {
                this.currentDir = this.nextDir;
                this.nextDir = { x: 0, y: 0 };
            }
        }

        // Move
        if (this.canMove(this.x, this.y, this.currentDir, maze)) {
            this.x += this.currentDir.x * this.speed * deltaTime;
            this.y += this.currentDir.y * this.speed * deltaTime;

            // Wrap around (tunnel)
            if (this.x < -this.tileSize) this.x = maze.map[0].length * this.tileSize;
            if (this.x > maze.map[0].length * this.tileSize) this.x = -this.tileSize;
        } else {
            // Align to grid if stuck
            // this.x = Math.round(this.x / this.tileSize) * this.tileSize;
            // this.y = Math.round(this.y / this.tileSize) * this.tileSize;
        }

        // Mouth animation
        if (this.mouthOpening) {
            this.mouthOpen += this.mouthSpeed * deltaTime;
            if (this.mouthOpen > 0.2) this.mouthOpening = false;
        } else {
            this.mouthOpen -= this.mouthSpeed * deltaTime;
            if (this.mouthOpen < 0) this.mouthOpening = true;
        }
    }

    canMove(x, y, dir, maze) {
        // Simple center point check for now, ideally check bounding box
        // Predicting next position
        const nextX = x + dir.x * (this.tileSize / 2); // Look ahead half a tile
        const nextY = y + dir.y * (this.tileSize / 2);

        // Check center
        const centerX = nextX + this.tileSize / 2;
        const centerY = nextY + this.tileSize / 2;

        return !maze.isWall(centerX, centerY);
    }

    draw(ctx) {
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();

        const cx = this.x + this.tileSize / 2;
        const cy = this.y + this.tileSize / 2;

        // Calculate rotation based on direction
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
