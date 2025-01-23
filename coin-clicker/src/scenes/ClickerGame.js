import { Scene } from 'phaser';

export class ClickerGame extends Scene
{
    constructor ()
    {
        super('ClickerGame');
    }

    create ()
    {
        this.score = 0;

        this.coins = [];

        var music = this.sound.get('soundtrack');
        music.play();

        const textStyle = { fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff', stroke: '#000000', strokeThickness: 8 };

        this.add.image(512, 384, 'background');

        this.scoreText = this.add.text(32, 32, 'Coins: 0', textStyle).setDepth(1);
        this.timeText = this.add.text(1024 - 32, 32, 'Time: 10', textStyle).setOrigin(1, 0).setDepth(1);

        //  Our 10 second timer. It starts automatically when the scene is created.
        this.timer = this.time.addEvent({ delay: 10000, callback: () => this.gameOver() });

        this.physics.world.setBounds(0, -400, 1024, 768 + 310);

        for (let i = 0; i < 32; i++)
        {
            let type = "normal";
            if (Phaser.Math.Between(0,9) == 1) {
                type = "red";
            }
            this.dropCoin(type);
        }

        this.input.on('gameobjectdown', (pointer, gameObject) => this.clickCoin(gameObject));
    }

    dropCoin (type)
    {
        const x = Phaser.Math.Between(128, 896);
        const y = Phaser.Math.Between(0, -400);

        const coin = this.physics.add.sprite(x, y, 'coin').play('rotate');
        coin.setDataEnabled();
        coin.setData('value', 1);
        coin.setData('sound', 'coin');

        if (type == "red") {
            coin.setTint(0xf0a1a1); // Red coin
            coin.setData('value', 5);
            coin.setData('sound', 'red_coin');
        }

        coin.setVelocityX(Phaser.Math.Between(-400, 400));
        coin.setCollideWorldBounds(true);
        coin.setBounce(0.9);
        coin.setInteractive();

        this.coins.push(coin);
    }

    clickCoin (coin)
    {
        //  Disable the coin from being clicked
        coin.disableInteractive();

        //  Stop it from moving
        coin.setVelocity(0, 0);

        //  Play the 'vanish' animation
        coin.play('vanish');

        // Play the 'coin' sound
        this.sound.play(coin.getData('sound'));


        coin.once('animationcomplete-vanish', () => coin.destroy());

        //  Add 1 to the score
        this.score+=coin.getData('value');

        //  Update the score text
        this.scoreText.setText('Coins: ' + this.score);

        //  Drop a new coin
        this.dropCoin();
    }

    update ()
    {
        this.timeText.setText('Time: ' + Math.ceil(this.timer.getRemainingSeconds()));
    }

    gameOver ()
    {
        this.coins.forEach((coin) => {

            if (coin.active)
            {
                coin.setVelocity(0, 0);

                coin.play('vanish');
            }

        });

        this.input.off('gameobjectdown');

        this.registry.set('score', this.score);
        
        //  Swap to the GameOver scene after a 2 second delay
        this.time.delayedCall(2000, () => this.scene.start('GameOver'));
    }

}
