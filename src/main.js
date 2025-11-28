import { Game } from './game/Game.js';

window.addEventListener('DOMContentLoaded', () => {
    const game = new Game('gameCanvas');

    // Start game on spacebar for now, or immediately
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !game.isRunning) {
            game.start();
            document.getElementById('status').innerText = 'PLAYING';
        }
    });
});
