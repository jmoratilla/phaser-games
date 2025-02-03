import Phaser from 'phaser';

export default class Paddle extends Phaser.GameObjects.Rectangle {
    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, color: number) {
        super(scene, x, y, width, height, color);
        scene.add.existing(this);
        scene.physics.world.enable(this, 1);
    }
}
