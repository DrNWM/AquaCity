import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import Stage01 from './scenes/Stage01.js';
import Stage02 from './scenes/Stage02.js';
import Stage03 from './scenes/Stage03.js';
import Stage04 from './scenes/Stage04.js';
import Stage05 from './scenes/Stage05.js';

export const gameConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [BootScene, Stage01, Stage02, Stage03, Stage04, Stage05]
};
