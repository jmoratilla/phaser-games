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

    constructor ()
    {
        super('Game');
    }

    preload ()
    {
        this.load.setPath('assets');
        this.load.audio('pong', 'pong.wav');
        
    }

    create ()
    {
        this.middleLine = this.add.rectangle(Number(this.sys.game.config.width)/2, 0, 2, Number(this.sys.game.config.height), 0x606060).setOrigin(0.5,0);
        this.score = new Score();
        this.leftPaddle = new Paddle(this, 18, 384, 20, 100, 0x6060ff); // blue
        this.rightPaddle = new Paddle(this, 1000, 384, 20, 100, 0xff6060); // red
        this.ball = this.add.circle(512, 384, 10, 0xffffff); // white
        this.result = this.add.text( 512, 0, this.score.toString(), { fontSize: '48px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5, 0);
        

        // Physics
        this.physics.world.setBounds(0, 0, 1024, 768);
        this.physics.world.setBoundsCollision(false, false, true, true);
        this.physics.world.enable(this.ball, 0);
    
        // Add collisions
        this.physics.add.collider(this.ball, this.leftPaddle, () => this.paddleHit(), undefined, this);
        // this.physics.add.collider(this.ball, this.rightPaddle, () => this.paddleHit(), undefined, this);
        
        
        // Add logic to move the ball
        this.ball.body
            .setCollideWorldBounds(true)
            .setBounce(1,1)
            .setVelocity(200,0);

        // Debug
        this.input.enableDebug(this.leftPaddle, 0xff00ff);
        this.input.enableDebug(this.rightPaddle, 0xff00ff);
    }

    update ()
    {
        // Add logic to move the left paddle
        this.input.on('pointermove', (pointer) => {
            this.leftPaddle.body.y = pointer.y;
        });

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
    }
    
    paddleHit()
    {
        // Play sound
        this.sound.play('pong');
        return (ball, paddle) => {
            ball.body.velocity.x *= -1;
            
            // Depending on the distance to the paddle center, change the ball's velocity.y
            let diff = 0;
            if (ball.y < paddle.y) {
                diff = paddle.y - ball.y;
                ball.body.velocity.y = (-10 * diff);
            } else if (ball.y > paddle.y) {
                diff = ball.y - paddle.y;
                ball.body.velocity.y = (10 * diff);
            } else {
                ball.body.velocity.y = 2 + Math.random() * 8;
            }
        };
    }
}
