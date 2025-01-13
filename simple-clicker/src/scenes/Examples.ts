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
        
        const closeButton: Phaser.GameObjects.Text = this.add.text(400-17, 17, '_', { fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff', stroke: '#000000', strokeThickness: 8 }).setOrigin(0.5).setInteractive();
        closeButton.setDataEnabled();
        closeButton.data.set('state', 'open');
        container1.add(closeButton);
        container1.setPosition((Number(this.game.config.width)-Number(200))/2, Number(this.game.config.height)/2);
        
        const options = [
            { id: 1, text: 'Option 1.....................5 clicks', y: 50, action: () => {this.option(1)} },
            { id: 2, text: 'Option 2...................10 clicks', y: 100, action: () => {this.option(2)} },
            { id: 3, text: 'Option 3...................25 clicks', y: 150, action: () => {this.option(3)} },
            { id: 4, text: 'Option 4...................50 clicks', y: 200, action: () => {this.option(4)} },
            { id: 5, text: 'Option 5.................100 clicks', y: 250, action: () => {this.option(5)} },
            { id: 6, text: 'Option 6...............1000 clicks', y: 300, action: () => {this.option(6)} },
            { id: 7, text: 'Option 7.............10000 clicks', y: 350, action: () => {this.option(7)} }
        ];
        
        options.forEach(option => {
            const text: Phaser.GameObjects.Text = this.add.text(10, option.y, option.text, { fontFamily: 'Arial Black', fontSize: 24, color: '#000000', stroke: '#ffffff', strokeThickness: 8 }).setOrigin(0);
            container1.add(text);
            text.setInteractive();
            text.on('pointerdown', () => {
                option.action();
            });
        });

        closeButton.on('pointerdown', () => {
            if (closeButton.data.get('state') === 'close') {
                this.tweens.add({
                    targets: container1,
                    y: Number(this.game.config.height)/2,
                    duration: 500,
                    ease: 'Linear'
                });
                closeButton.data.set('state', 'open');
            } else {
                this.tweens.add({
                    targets: container1,
                    y: 735,
                    duration: 500,
                    ease: 'Linear'
                });
                closeButton.data.set('state', 'close');
            }
        });
        const circle1: Phaser.GameObjects.Graphics = this.add.graphics({ fillStyle: { color: 0xff0000 } });
    }

    option (id: number): void
    {
        console.log('Option ' + id + ' clicked');
    }

}