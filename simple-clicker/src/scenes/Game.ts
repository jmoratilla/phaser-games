import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    preload ()
    {
        this.load.setPath('assets');
        this.load.audio('music', 'sounds/audio.mp3');
        
        this.load.image('background', 'bg.png');
        this.load.audio('click', 'sounds/click.wav');

        this.load.image('metal', 'textures/alien-metal.jpg');
        this.load.image('grass', 'textures/grass.png');
        this.load.image('tiles', 'textures/tiles.jpg');
        this.load.glsl('bundle', 'shaders/bundle.glsl.js');
    }

    create ()
    {
        
        const textStyle: object = { fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff', stroke: '#000000', strokeThickness: 8 };
        const background: Phaser.GameObjects.Image = this.add.image(512, 384, 'background');
        const shader: Phaser.GameObjects.Shader = this.add.shader('Tunnel', 512, 384, 1024, 768, [ 'tiles' ]).setVisible(false);
        const button: Phaser.GameObjects.Text = this.add.text(512, 384, 'Click me', textStyle).setOrigin(0.5);
        const textScore: Phaser.GameObjects.Text = this.add.text(512, 450, 'Score: 0', textStyle).setOrigin(0.5);
        

        // Button configuration
        button.setDataEnabled();
        button.data.set('score', 0);
        button.setInteractive();

        // Button events
        // Button click
        button.on('pointerdown', () => {
            this.buttonEffect(button);
            button.data.set('score', button.data.get('score') + 1);
            this.sound.play('click');
            textScore.setText('Score: ' + button.data.get('score'));
        })

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

        // Button score change
        button.on('changedata-score',  (_gameObject: Phaser.GameObjects.Text, value: any) => {
            // Milestones
            switch(value) {
                case 5:
                {
                    this.sound.play('music');
                    break;
                }
                case 15: 
                {
                    shader.setVisible(true);
                    break;
                }
                case 20:
                {
                    shader.setChannel0('grass');
                    break;
                }
                case 30:
                {
                    shader.setChannel0('metal');
                    break;
                }
            }
        }, this);

    }

    buttonEffect(button: Phaser.GameObjects.Text)
    {
        if (button.preFX) { 
            var effect: object = button.preFX.addShadow(0, 0, 0.05, 1, 0x333333, 15);
            this.add.tween({
                targets: effect,
                x: 10,
                y: -10,
                duration: 300,
                repeat: 0
            });
            this.add.tween({
                targets: effect,
                x: 0,
                y: -0,
                samples: 10,
                duration: 0,
            });
        } else {
            console.warn('No preFX available');
        }
    }

    option (id: number): void
    {
        console.log('Option ' + id + ' clicked');
    }
}
