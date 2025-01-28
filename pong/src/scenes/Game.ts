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
        
    }

    create ()
    {
        const leftPaddle = this.add.rectangle(18, 384, 20, 100, 0xffffff);
        const rightPaddle = this.add.rectangle(1000, 384, 20, 100, 0xffffff);
        const ball = this.add.circle(512, 384, 10, 0xffffff).setOrigin(0.5);
        const middleLine = this.add.rectangle(512, 0, 2, 768, 0xffffff).setOrigin(0);
        const score = this.add.text(512, 0, '0 - 0', { fontSize: '32px', color: '#ffffff', fontStyle: 'bold'  }).setOrigin(0.5, 0);
        
        this.physics.world.setBounds(0, 0, 1024, 768);

        this.physics.world.enable(rightPaddle, 1);
        this.physics.world.enable(leftPaddle, 1);
        this.physics.world.enable(ball, 1);


        this.physics.add.collider(ball, rightPaddle);
        this.physics.add.collider(ball, leftPaddle);

        this.input.on('pointermove', (pointer) => {
            leftPaddle.y = pointer.y;
        });
    }
}
