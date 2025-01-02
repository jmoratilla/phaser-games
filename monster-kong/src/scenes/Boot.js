import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('background', 'assets/bg.png');
        
        this.load.image('ground','assets/images/ground.png');
        this.load.image('platform','assets/images/platform.png');
        this.load.image('goal','assets/images/gorilla3.png');
        this.load.image('arrowButton','assets/images/arrowButton.png');
        this.load.image('actionButton','assets/images/actionButton.png');
        this.load.image('barrel','assets/images/barrel.png');
        
        this.load.spritesheet('player','assets/images/player_spritesheet.png',28,30,5,1,1);
        this.load.spritesheet('fire','assets/images/fire_spritesheet.png',20,21,2,1,1);
        
        this.load.text('level','assets/data/level.json');
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
