import { Scene } from "phaser";

export class Game extends Scene {

  // Instance variables
  options: {
    id: number;
    text: string;
    y: number;
    cost: number;
    action: () => void;
  }[];

  score: number = 0;
  
  constructor() {
    super("Game");
  }

  preload() {
    this.load.setPath("assets");
    this.load.audio("music", "sounds/audio.mp3");

    this.load.image("background", "bg.png");
    this.load.audio("click", "sounds/click.wav");

    this.load.image("metal", "textures/alien-metal.jpg");
    this.load.image("grass", "textures/grass.png");
    this.load.image("tiles", "textures/tiles.jpg");
    this.load.glsl("bundle", "shaders/bundle.glsl.js");
  }

  create() {
    const options: {
      name: number;
      text: string;
      y: number;
      cost: number;
      action: () => void;
    }[] = [
      {
        name: 0,
        text: "Option 1.....................5 clicks",
        y: 50,
        cost: 5,
        action: () => {
          this.option(option);
        },
      },
      {
        name: 1,
        text: "Option 2...................10 clicks",
        y: 100,
        cost: 10,
        action: () => {
          this.option(option);
        },
      },
      {
        name: 2,
        text: "Option 3...................25 clicks",
        y: 150,
        cost: 25,
        action: () => {
          this.option(option);
        },
      },
      {
        name: 3,
        text: "Option 4...................50 clicks",
        y: 200,
        cost: 50,
        action: () => {
          this.option(option);
        },
      },
      {
        name: 4,
        text: "Option 5.................100 clicks",
        y: 250,
        cost: 100,
        action: () => {
          this.option(option);
        },
      },
      {
        name: 5,
        text: "Option 6...............1000 clicks",
        y: 300,
        cost: 1000,
        action: () => {
          this.option(option);
        },
      },
      {
        name: 6,
        text: "Option 7.............10000 clicks",
        y: 350,
        cost: 10000,
        action: () => {
          this.option(option);
        },
      },
    ];

    // TextStyle for the game
    const textStyle: object = {
      fontFamily: "Arial Black",
      fontSize: 38,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 8,
    };

    // Background, shader, button and score
    const background: Phaser.GameObjects.Image = this.add.image(
      512,
      384,
      "background",
    );

    const shader: Phaser.GameObjects.Shader = this.add
      .shader("Tunnel", 512, 384, 1024, 768, ["tiles"])
      .setVisible(false);
    
    const containerButton: Phaser.GameObjects.Container = this.add.container(0, 0);
    const bgButton: Phaser.GameObjects.Graphics = this.add.graphics();
    bgButton.lineStyle(3, 0x0f0f0f, 1);
    bgButton.strokeRoundedRect(0, 15, 200, 65, 16);
    containerButton.add(bgButton);
    // Button configuration
    const button: Phaser.GameObjects.Text = this.add
      .text(100, 50, "Click me", textStyle)
      .setOrigin(0.5);
  
    button.setDataEnabled();
    button.data.set("score", 0);
    button.setInteractive();

    containerButton.add(button);
    containerButton.setPosition(
      (Number(this.game.config.width) - Number(200)) / 2,
      (Number(this.game.config.height) - Number(300)) / 2,
    );

    const textScore: Phaser.GameObjects.Text = this.add
      .text(512, 350, "Score: 0", textStyle)
      .setOrigin(0.5);

    // Button events
    // .onClick
    button.on("pointerdown", () => {
      this.buttonEffect(button);
      button.data.set("score", button.data.get("score") + 1);
      this.score = button.data.get("score");
      this.sound.play("click");
      // textScore.setText('Score: ' + button.data.get('score'));
      textScore.setText("Score: " + this.score);
    });

    // Menu
    const containerMenu: Phaser.GameObjects.Container = this.add.container(0, 0);
    const bg1: Phaser.GameObjects.Graphics = this.add.graphics({
      fillStyle: { color: 0xffffff },
    });
    bg1.fillRect(0, 0, 400, 400);
    containerMenu.add(bg1);

    const closeButton: Phaser.GameObjects.Text = this.add
      .text(400 - 17, 17, "_", {
        fontFamily: "Arial Black",
        fontSize: 24,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
      })
      .setOrigin(0.5)
      .setInteractive();
    closeButton.setDataEnabled();
    closeButton.data.set("state", "open");
    containerMenu.add(closeButton);
    containerMenu.setPosition(
      (Number(this.game.config.width) - Number(200)) / 2,
      (Number(this.game.config.height) + Number(700)) / 2,
    );

    // Options
    options.forEach((option) => {
      const text: Phaser.GameObjects.Text = this.add
        .text(10, option.y, option.text, {
          fontFamily: "Arial Black",
          fontSize: 24,
          color: "#cacaca",
          stroke: "#ffffff",
          strokeThickness: 8,
        })
        .setOrigin(0);
      text.setName(option.name);
      containerMenu.add(text);
    });

    closeButton.on("pointerdown", () => {
      if (closeButton.data.get("state") === "close") {
        this.tweens.add({
          targets: containerMenu,
          y: Number(this.game.config.height) / 2,
          duration: 500,
          ease: "Linear",
        });
        closeButton.data.set("state", "open");
      } else {
        this.tweens.add({
          targets: containerMenu,
          y: 735,
          duration: 500,
          ease: "Linear",
        });
        closeButton.data.set("state", "close");
      }
    });

    // Button score change
    button.on(
      "changedata-score",
      (_gameObject: Phaser.GameObjects.Text, value: any) => {
        // Milestones
        switch (value) {
          case 5: {
            let option: Phaser.GameObjects.Text = containerMenu.getByName(0);
            option.setColor("#000000");
            option.setInteractive();
            this.sound.play("music");
            break;
          }
          case 15: {
            let option: Phaser.GameObjects.Text = containerMenu.getByName(1);
            option.setColor("#000000");
            option.setInteractive();
            shader.setVisible(true);
            break;
          }
          case 20: {
            let option: Phaser.GameObjects.Text = containerMenu.getByName(2);
            option.setColor("#000000");
            option.setInteractive();
            shader.setChannel0("grass");
            break;
          }
          case 30: {
            let option: Phaser.GameObjects.Text = containerMenu.getByName(3);
            option.setColor("#000000");
            option.setInteractive();
            shader.setChannel0("metal");
            break;
          }
        }
      },
      this,
    );
  }

  buttonEffect(button: Phaser.GameObjects.Text) {
    if (button.preFX) {
      var effect: object = button.preFX.addShadow(0, 0, 0.05, 1, 0x333333, 15);
      this.add.tween({
        targets: effect,
        x: 10,
        y: -10,
        duration: 300,
        repeat: 0,
      });
      this.add.tween({
        targets: effect,
        x: 0,
        y: -0,
        samples: 10,
        duration: 0,
      });
    } else {
      console.warn("No preFX available");
    }
  }

  enableOption(this: Phaser.Game, id: number): void {
    let option = this.options[id];
    console.log("option: " + option);
    option.text.setColor("#000000");
    option.setInteractive(true);
    console.log("Option " + id + " enabled");
  }

  option(option: {
    id: number;
    text: string;
    y: number;
    cost: number;
    action: () => void;
  }): void {
    console.log("Option " + option.id + " clicked");
    this.score -= option.cost;
  }
}
