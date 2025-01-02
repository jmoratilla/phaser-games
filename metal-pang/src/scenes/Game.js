import { Scene } from 'phaser';

export class Game extends Scene
{

    
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.sound.play('soundtrack');

        // Create the background
        this.add.image(400, 300, 'metal_bg');
        
        // Initialize the score
        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000000' });

        // Create the platforms group
        this.platforms = this.physics.add.staticGroup();

        // Create some platforms to jump on
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        // Create the player
        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
        
        // Create a collider between the player and the platforms
        this.physics.add.collider(this.player, this.platforms);
        
        // Create the stars
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.stars.children.iterate((child) => {
            child.setDataEnabled();
            child.setData('sound', 'star');
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        // Create a collider between the stars and the platforms
        this.physics.add.collider(this.stars, this.platforms);

        // Create a collider between the player and the stars
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        // Create bombs
        this.bombs = this.physics.add.group();
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

        // Create the keyboard cursors
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    collectStar (player, star)
    {
        star.disableBody(true, true);
        this.sound.play(star.getData('sound'));
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        if (this.stars.countActive(true) === 0)
        {
            this.stars.children.iterate((child) => {
                child.enableBody(true, child.x, 0, true, true);
            });

            var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            var bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setDataEnabled();
            bomb.setData('sound', 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200,200), 20);
        }
    }

    hitBomb (player, bomb)
    {
        this.sound.play(bomb.getData('sound'));
        this.physics.pause();
        this.player.setTint(0xff0000);
        this.player.anims.play('turn');
        this.gameOver();

    }

    update ()
    {
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-180);
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(180);
            this.player.anims.play('right', true);
        }
        else 
        {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-320);
        } 
    }

    gameOver ()
    {

        this.input.off('gameobjectdown');
        
        //  Swap to the GameOver scene after a 2 second delay
        this.time.delayedCall(2000, () => this.scene.start('GameOver'));
    }

}
