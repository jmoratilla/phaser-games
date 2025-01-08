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

    preload ()
    {
        this.load.setPath('assets');
        
        this.load.image('background', 'bg.png');
        //this.load.image('logo', 'logo.png');
        this.load.audio('click', 'sounds/click.wav');
    }

    create ()
    {
        
        this.add.image(512, 384, 'background');
        const textStyle: object = { fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff', stroke: '#000000', strokeThickness: 8 };
        
        this.button = this.add.text(512, 384, 'Click me', textStyle).setInteractive().on('pointerdown', () => {
            // this.button.setStyle({ color: '#a0a0a0' });
            this.score++;
            this.sound.play('click');
            this.clicked = true;
        }).setOrigin(0.5);
        
        
        // this.add.tween({
        //     targets: this.button,
        //     scale: 1.05,
        //     duration: 800,
        //     alpha: 0.1,
        //     yoyo: true,
        //     repeat: -1,
        // });

        this.textScore = this.add.text(512, 450, 'Score: ' + this.score, textStyle).setOrigin(0.5);
        
    }

    update() {
        if (this.clicked)
            {
                this.buttonEffect();
                this.textScore.setText('Score: ' + this.score);
                this.clicked = false;
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
