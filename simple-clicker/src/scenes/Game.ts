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
        this.add.image(512, 384, 'background');

        const shader: Phaser.GameObjects.Shader = this.add.shader('Tunnel', 512, 384, 1024, 768, [ 'tiles' ]).setVisible(false);

        const button: Phaser.GameObjects.Text = this.add.text(512, 384, 'Click me', textStyle).setOrigin(0.5);
        button.setDataEnabled();
        button.data.set('score', 0);
        button.setInteractive();
        
        const textScore: Phaser.GameObjects.Text = this.add.text(512, 450, 'Score: ' + button.data.get('score'), textStyle).setOrigin(0.5);
        

        button.on('pointerdown', () => {
            this.buttonEffect(button);
            button.data.set('score', button.data.get('score') + 1);
            this.sound.play('click');
            textScore.setText('Score: ' + button.data.get('score'));
        })

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
}
