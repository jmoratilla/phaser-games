import { Scene } from 'phaser';

export class Examples extends Scene
{
    constructor ()
    {
        super('Examples');
    }

    create ()
    {
        // Marketplace
        const container1: Phaser.GameObjects.Container = this.add.container(0, 0);
        const bg1: Phaser.GameObjects.Graphics = this.add.graphics({ fillStyle: { color: 0xffffff } });
        bg1.fillRect(0, 0, 400, 400);
        container1.add(bg1);
        
        const closeButton: Phaser.GameObjects.Text = this.add.text(400-17, 17, 'X', { fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff', stroke: '#000000', strokeThickness: 8 }).setOrigin(0.5).setInteractive();
        container1.add(closeButton);
        container1.setPosition(Number(this.game.config.width)/2, Number(this.game.config.height)/2);
        
        closeButton.on('pointerdown', () => {
            this.tweens.add({
                targets: container1,
                y: 768,
                duration: 500,
                ease: 'Linear'
            });
        });
        const circle1: Phaser.GameObjects.Graphics = this.add.graphics({ fillStyle: { color: 0xff0000 } });

    }

}