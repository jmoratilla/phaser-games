import { Preloader } from './scenes/Preloader';
import { Game as MainGame } from './scenes/Game';
import { AUTO, Game, Scale,Types } from 'phaser';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    parent: 'game-container',
    backgroundColor: '#000000',
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH
    },
    scene: [
        Preloader,
        MainGame
    ]
};

export default new Game(config);
