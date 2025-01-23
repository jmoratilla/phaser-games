import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        this.add.image(512, 384, 'background');

        this.add.bitmapText(512, 50, 'arcade', 'Game Over').setOrigin(0.5);

        const length_scores = this.registry.get('high_scores').length;

        if (this.registry.get('score') > this.registry.get('high_scores')[length_scores-1].score) {
            this.add.bitmapText(512, 150, 'arcade', "Congratulations!\nYou scored high!").setOrigin(0.5).setMaxWidth(720);
            this.newHighScore();
        } else {
            this.add.bitmapText(512, 200, 'arcade', "Sorry, you didn't quite crack the top scores").setOrigin(0.5).setMaxWidth(720);
            this.toMainMenu();
        }
        
    }

    newHighScore()
    {
        // Create the Matrix of Letters
        const chars = [
            [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J' ],
            [ 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T' ],
            [ 'U', 'V', 'W', 'X', 'Y', 'Z', '.', '-', '<', '>' ]
        ];

        const cursor = {x:0, y:0};

        const input = this.add.bitmapText(256,200, 'arcade', 'ABCDEFGHIJ\n\nKLMNOPQRST\n\nUVWXYZ.-').setLetterSpacing(20);
        input.setInteractive();

        const rub = this.add.image(input.x + 430, input.y + 148, 'rub');
        const end = this.add.image(input.x + 482, input.y + 148, 'end');

        const block = this.add.image(input.x - 10, input.y -2, 'block').setOrigin(0);

        const legend = this.add.bitmapText(256, 400, 'arcade', 'RANK  SCORE   NAME').setTint(0xff00ff).setOrigin(0);

        let new_score = {
            score: this.registry.get('score'),
            name: ''
        };

        // Controls - Keyboard
        this.input.keyboard.on('keyup', event =>
            {
    
                if (event.keyCode === 37)
                {
                    //  left
                    if (cursor.x > 0)
                    {
                        cursor.x--;
                        block.x -= 52;
                    }
                }
                else if (event.keyCode === 39)
                {
                    //  right
                    if (cursor.x < 9)
                    {
                        cursor.x++;
                        block.x += 52;
                    }
                }
                else if (event.keyCode === 38)
                {
                    //  up
                    if (cursor.y > 0)
                    {
                        cursor.y--;
                        block.y -= 64;
                    }
                }
                else if (event.keyCode === 40)
                {
                    //  down
                    if (cursor.y < 2)
                    {
                        cursor.y++;
                        block.y += 64;
                    }
                }
                else if (event.keyCode === 13 || event.keyCode === 32)
                {
                    //  Enter or Space
                    if (cursor.x === 9 && cursor.y === 2 && new_score.name.length > 0)
                    {
                        //  Submit
                        this.toMainMenu();
                    }
                    else if (cursor.x === 8 && cursor.y === 2 && new_score.name.length > 0)
                    {
                        //  Rub
                        new_score.name = new_score.name.substr(0, new_score.name.length - 1);
    
                        this.updateScores(new_score);
                    }
                    else if (new_score.name.length < 3)
                    {
                        //  Add
                        new_score.name = new_score.name.concat(chars[cursor.y][cursor.x]);
    
                        this.updateScores(new_score);
                    }
                }
    
            }
        );

        // Controls - Pointer
        input.on('pointermove', (pointer, x, y) =>
            {
    
                const cx = Phaser.Math.Snap.Floor(x, 52, 0, true);
                const cy = Phaser.Math.Snap.Floor(y, 64, 0, true);
                const char = chars[cy][cx];
    
                cursor.x = cx;
                cursor.y = cy;
    
                block.x = input.x - 10 + (cx * 52);
                block.y = input.y - 2 + (cy * 64);
    
            }, this);
    
            input.on('pointerup', (pointer, x, y) =>
            {
    
                const cx = Phaser.Math.Snap.Floor(x, 52, 0, true);
                const cy = Phaser.Math.Snap.Floor(y, 64, 0, true);
                const char = chars[cy][cx];
    
                cursor.x = cx;
                cursor.y = cy;
    
                block.x = input.x - 10 + (cx * 52);
                block.y = input.y - 2 + (cy * 64);
    
                if (char === '<' && new_score.name.length > 0)
                {
                    //  Rub
                    new_score.name = new_score.name.substr(0, new_score.name.length - 1);
    
                    this.updateScores(new_score);
                }
                else if (char === '>' && new_score.name.length > 0)
                {
                    //  Submit
                    this.toMainMenu();
                }
                else if (new_score.name.length < 3)
                {
                    //  Add
                    new_score.name = new_score.name.concat(char);
    
                    this.updateScores(new_score);
                }
    
            }, this);
    }

    toMainMenu ()
    {
        //  Swap to the MainMenu scene after a 2 second delay after pressing the end
        this.time.delayedCall(2000, () => {
            // Stop the music    
            var music = this.sound.get('soundtrack');
            music.stop();
            this.scene.start('MainMenu')
        });
    }

    updateScores (new_score)
    {
        // Get the high_scores
        let high_scores = this.registry.get('high_scores');

        Phaser.Utils.Array.Add(high_scores,new_score);
        Phaser.Utils.Array.StableSort(high_scores,(a, b) => b.score - a.score);

        this.registry.set('high_scores', high_scores);
        this.printTable();
        
    }

    clearTable()
    {
        let posX = 256;
        let posY = 550;        
        let high_scores = this.registry.get('high_scores');
        // Reprint the table
        console.log("clear the table...")
        
        for (let i=0; i< high_scores.length; i++) {
            let text = '';
            this.add.bitmapText(posX, posY, 'arcade', text).setTint(cardinals_and_colors[i].color).setOrigin(0);
            posY+=50;
        };
    }

    printTable()
    {
        const cardinals_and_colors = [
            {key: '1ST', color: 0xff0000},
            {key: '2ND', color: 0xff8200},
            {key: '3RD', color: 0xffff00},
            {key: '4TH', color: 0x00ff00},
            {key: '5TH', color: 0x00bfff}
        ];
        
        let posX = 256;
        let posY = 450;
        let high_scores = this.registry.get('high_scores');

        // Reprint the table
        console.log("reprint the table...")
        
        for (let i=0; i< high_scores.length; i++) {
            let text = cardinals_and_colors[i].key + "      " + Phaser.Utils.String.Pad(high_scores[i].score, 3, "0", 1) + "    " + high_scores[i].name;
            this.add.bitmapText(posX, posY, 'arcade', text).setTint(cardinals_and_colors[i].color).setOrigin(0);
            posY+=50;
        };
    }

}
