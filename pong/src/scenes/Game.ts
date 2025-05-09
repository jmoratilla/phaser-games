import { Scene } from 'phaser';
import Paddle from '../gameObjects/paddle';
import Score from '../gameObjects/score';

export class Game extends Scene
{

    leftPaddle: Paddle;
    rightPaddle: Paddle;
    ball: Phaser.GameObjects.Shape;
    middleLine: Phaser.GameObjects.Rectangle;
    score: Score;
    result: Phaser.GameObjects.Text;
    maxGoals: number = 10;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.middleLine = this.add.rectangle(Number(this.sys.game.config.width)/2, 0, 2, Number(this.sys.game.config.height), 0x606060).setOrigin(0.5,0);
        this.score = new Score();
        this.add.text( 100, 10, 'Player 1 (W/S)', { fontSize: '24px', color: '#ffffff', fontStyle: 'bold' });
        this.add.text( 700, 10, 'Player 2 (UP/DOWN)', { fontSize: '24px', color: '#ffffff', fontStyle: 'bold' });
        this.leftPaddle = new Paddle(this, 18, 384, 20, 100, 0x6060ff).setOrigin(0.5,0.5); // blue
        this.rightPaddle = new Paddle(this, 1000, 384, 20, 100, 0xff6060).setOrigin(0.5,0.5); // red
        this.ball = this.add.circle(512, 384, 10, 0xffffff); // white
        this.result = this.add.text( 512, 0, this.score.toString(), { fontSize: '48px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5, 0);

        // Physics
        this.physics.world.setBounds(0, 0, 1024, 768);
        this.physics.world.setBoundsCollision(false, false, true, true);
        this.physics.add.existing(this.ball, false);

        // Add collisions between the paddles and the ball
        this.physics.add.collider(this.ball, this.leftPaddle, this.paddleHit, undefined, this);
        this.physics.add.collider(this.ball, this.rightPaddle, this.paddleHit, undefined, this);
        
        // Start the game
        this.gameStart();

        // Debug
        this.input.enableDebug(this.leftPaddle, 0xff00ff);
        this.input.enableDebug(this.rightPaddle, 0xff00ff);
    }

    update ()
    {
        // Keyboard input to control the left paddle with (W/S) keys
        if (this.input.keyboard.addKey('W').isDown && this.leftPaddle.y > 50) {
            this.leftPaddle.y -= 5;
            this.leftPaddle.body.y -= 5;
        }
        if (this.input.keyboard.addKey('S').isDown && this.leftPaddle.y < 718) {
            this.leftPaddle.y += 5;
            this.leftPaddle.body.y += 5;
        }

        // Keyboard input to control the right paddle with cursor keys
        if (this.input.keyboard.addKey('UP').isDown && this.rightPaddle.y > 50) {
            this.rightPaddle.y -= 5;
            this.rightPaddle.body.y -= 5;
        }
        if (this.input.keyboard.addKey('DOWN').isDown && this.rightPaddle.y < 718) {
            this.rightPaddle.y += 5;
            this.rightPaddle.body.y += 5;
        }

        // Add logic to reset the ball if it goes out of bounds
        if (this.ball.x < 0) {
            this.ball.setPosition(512, 384);
            (this.ball.body as Phaser.Physics.Arcade.Body).setVelocity(200, 0);
            this.score.update(this.score.left, this.score.right + 1 );
            this.result.setText(this.score.toString());
        } else if (this.ball.x > 1024) {
            this.ball.setPosition(512, 384);
            (this.ball.body as Phaser.Physics.Arcade.Body).setVelocity(-200, 0);
            this.score.update(this.score.left + 1, this.score.right);
            this.result.setText(this.score.toString());
        }

        if (this.score.left >= this.maxGoals || this.score.right >= this.maxGoals) {
            this.gameOver();
        }

        // // If left click is pressed, pause the game
        // if (this.input.activePointer.leftButtonDown()) {
        //     // Get the current scene
        //     let gameScene = this.scene.get('Game');
        //     const pausedMsg = this.add.text( 512, 384, 'Game Paused', { fontSize: '48px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5, 0.5);
        //     pausedMsg.setVisible(false);
        //     if (!gameScene.sys.isSleeping()) {
        //         pausedMsg.setVisible(true);
        //         gameScene.sys.sleep();
        //     } else {
        //         pausedMsg.setVisible(false);
        //         gameScene.sys.wake();
        //     }

        // }

    }
    
    paddleHit()
    {
        // Play sound
        this.sound.play('pong');

        // Increase ball speed
        let velocity = (this.ball.body as Phaser.Physics.Arcade.Body).velocity;
        if (velocity.x < 0) {
            velocity.x -= 25;
        }
        else {
            velocity.x += 25;
        }

        // Determine the paddle that hits the ball
        let paddle = this.leftPaddle;
        if (this.ball.x > 512) {
            paddle = this.rightPaddle;
        }

        // Randomize vertical direction depending on the distance of the ball to the the paddle center when hit.
        // If it hits the center, it will go straight up or down.
        let distance = this.ball.y - paddle.y;

        // Calculate the angle of the ball
        let angle = Phaser.Math.DegToRad(45 * (distance / (paddle.height / 2)));

        // Set the new velocity
        velocity.y = Math.sin(angle) * 250;
        paddle.body.velocity.y = velocity.y;
    }

    gameStart()
    {
        // Add banner 'Press ANY key to start'
        const startMsg = this.add.text( 512, 384, 'Press ANY key to start', { fontSize: '48px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5, 0.5);
        this.input.keyboard.once('keydown', () => {
            // Play soundtrack
            this.sound.play('soundtrack', { loop: true });

            startMsg.destroy();
            // Add logic to move the ball
            this.ball.body
            .setCollideWorldBounds(true)
            .setBounce(1,1)
            .setVelocity(300,0);
        });

    }

    gameOver()
    {
        // Stop the soundtrack
        this.sound.stopAll();
        this.sound.removeAll();
        
        // Add game over message
        this.add.text( 512, 384, 'Game Over', { fontSize: '48px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5, 0.5);
        
        this.input.keyboard.once('keydown', () => {
            this.scene.restart();
        });
    }
}
