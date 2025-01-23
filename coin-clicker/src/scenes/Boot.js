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

        this.load.image('preloader', 'assets/preloader.png');
    }

    create ()
    {
        //  A global value to store the score in
        this.registry.set('score', 0);
        this.registry.set('high_scores', [
            { score: 20, name: 'KUR'},
            { score: 12, name: 'KUR'},
            { score: 10, name: 'KUR'},
            { score: 5, name: 'KUR'},
            { score: 1, name: 'KUR'},
        ]);

        // this.scene.start('Preloader');

        this.input.once('pointerdown', () => {

            this.scene.start('Preloader');

        });
    }
}
