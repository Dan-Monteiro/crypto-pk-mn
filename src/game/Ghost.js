export class Ghost {
    constructor(x, y, tileSize, color) {
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.tileSize = tileSize;
        this.color = color;
        this.speed = 80;
        this.dir = { x: 1, y: 0 };
        this.radius = tileSize / 2 - 2;
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.dir = { x: 1, y: 0 };
    }

    update(deltaTime, maze, pacman) {
        if (this.canMove(this.x, this.y, this.dir, maze)) {
            this.x += this.dir.x * this.speed * deltaTime;
            this.y += this.dir.y * this.speed * deltaTime;

            if (this.x < -this.tileSize) this.x = maze.map[0].length * this.tileSize;
            if (this.x > maze.map[0].length * this.tileSize) this.x = -this.tileSize;
        } else {
            this.changeDirection(maze);
        }

        if (Math.random() < 0.02) {
            this.changeDirection(maze);
        }
    }

    changeDirection(maze) {
        const dirs = [
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: -1, y: 0 },
            { x: 1, y: 0 }
        ];

        const validDirs = dirs.filter(d => this.canMove(this.x, this.y, d, maze));

        if (validDirs.length > 0) {
            this.dir = validDirs[Math.floor(Math.random() * validDirs.length)];
        } else {
            this.dir = { x: -this.dir.x, y: -this.dir.y };
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
        ctx.fillStyle = this.color;
        ctx.beginPath();

        const cx = this.x + this.tileSize / 2;
        const cy = this.y + this.tileSize / 2;

        ctx.arc(cx, cy - 2, this.radius, Math.PI, 0);
        ctx.lineTo(cx + this.radius, cy + this.radius);
        ctx.lineTo(cx - this.radius, cy + this.radius);
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(cx - 4, cy - 4, 3, 0, Math.PI * 2);
        ctx.arc(cx + 4, cy - 4, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(cx - 4 + this.dir.x * 2, cy - 4 + this.dir.y * 2, 1.5, 0, Math.PI * 2);
        ctx.arc(cx + 4 + this.dir.x * 2, cy - 4 + this.dir.y * 2, 1.5, 0, Math.PI * 2);
        ctx.fill();
    }
}
