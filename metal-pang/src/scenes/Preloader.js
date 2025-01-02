import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');
        this.load.image('metal_bg', 'metal_bg.png');
        this.load.image('logo', 'logo.png');
        this.load.image('ground', 'images/platform.png');
        this.load.image('sky', 'images/sky.png');
        this.load.image('star', 'images/star.png');
        this.load.image('bomb', 'images/bomb.png');
        this.load.spritesheet('dude', 
            'images/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );

        // Load Sound Effects and Soundtrack
        this.load.audio('star', 'sounds/coin.wav');
        this.load.audio('bomb', 'sounds/bomb.wav');
        this.load.audio('soundtrack', 'sounds/metal_soundtrack.mp3');

    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.
        
        // Create animations for the player
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        //  When all the assets are loaded go to the next scene.
        //  We can go there immediately via: this.scene.start('MainMenu');
        //  Or we could use a Scene transition to fade between the two scenes:

        this.scene.transition({
            target: 'MainMenu',
            duration: 1000,
            moveBelow: true,
            onUpdate: (progress) => {
                this.cameras.main.setAlpha(1 - progress);
            }
        });
    }
}
