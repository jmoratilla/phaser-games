import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    score: number = 0;
    button: Phaser.GameObjects.Text;
    textScore: Phaser.GameObjects.Text;
    clicked: boolean = false;
    shader: Phaser.GameObjects.Shader;

    preload ()
    {
        this.load.setPath('assets');
        
        this.load.image('background', 'bg.png');
        this.load.audio('click', 'sounds/click.wav');

        this.load.image('metal', 'textures/alien-metal.jpg');
        this.load.image('grass', 'textures/grass.png');
        this.load.image('tiles', 'textures/tiles.jpg');
        this.load.glsl('bundle', 'shaders/bundle.glsl.js');
        this.load.audio('music', 'sounds/audio.mp3');
    }

    create ()
    {
        
        const textStyle: object = { fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff', stroke: '#000000', strokeThickness: 8 };
        this.add.image(512, 384, 'background');

        this.shader = this.add.shader('Tunnel', 512, 384, 512, 512, [ 'tiles', 'green', 'metal' ]).setVisible(false);
        


        this.button = this.add.text(512, 384, 'Click me', textStyle).setInteractive().on('pointerdown', () => {
            // this.button.setStyle({ color: '#a0a0a0' });
            this.score++;
            this.sound.play('click');
            this.clicked = true;
        }).setOrigin(0.5);
        

        this.textScore = this.add.text(512, 450, 'Score: ' + this.score, textStyle).setOrigin(0.5);
        

    }

    update() {
        if (this.clicked)
        {
            this.buttonEffect();
            this.textScore.setText('Score: ' + this.score);
            this.clicked = false;

            // Milestones
            switch(this.score) {
                case 5:
                {
                    this.sound.play('music');
                    break;
                }
                case 15: 
                {
                    this.shader.setVisible(true);
                    break;
                }
                case 30:
                {
                    var textureKey = this.shader.getUniform('iChannel0').textureKey;
                    console.log(textureKey);
                    this.shader.setChannel0('green');
                    break;
                }
            }
        }

    }

    buttonEffect()
    {
        var effect: object = this.button.preFX.addShadow(0, 0, 0.006, 2, 0x333333, 10);
        this.add.tween({
            targets: effect,
            x: 10,
            y: -10,
            duration: 200,
            repeat: 0
        });
        this.add.tween({
            targets: effect,
            x: 0,
            y: -0,
            samples: 0,
            duration: 0,
        });
    }
}
