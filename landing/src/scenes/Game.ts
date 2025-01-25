import { Scene } from "phaser";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  preload() {
    this.load.setPath("assets");

    this.load.image("background", "bg.png");
    this.load.image("logo", "logo.png");
    this.load.image("coin-clicker", "coin-clicker.png");
    this.load.image("memory", "memory.png");
    this.load.image("clicker", "clicker.png");
  }

  create() {
    this.add.image(512, 384, "background");
    const logo = this.add.image(512, 100, "logo").setDepth(100);
    const text = this.add
      .text(512, 200, "My games made with Phaser", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(100);

    logo.setInteractive();
    logo.on("pointerdown", () => {
      window.open("https://phaser.io", "_blank");
    });

    const cc = this.make
      .image({
        x: 200,
        y: 350,
        key: "coin-clicker",
        scale: {
          x: 0.2,
          y: 0.2,
        },
      })
      .setInteractive();
    cc.on("pointerdown", () => {
      window.open("https://games.moratilla.com/coin-clicker/", "_blank");
    });

    const mc = this.make
      .image({
        x: 800,
        y: 350,
        key: "memory",
        scale: {
          x: 0.2,
          y: 0.2,
        },
      })
      .setInteractive();
    mc.on("pointerdown", () => {
      window.open("https://games.moratilla.com/memory-circles/", "_blank");
    });

    const sc = this.make
      .image({
        x: 500,
        y: 350,
        key: "clicker",
        scale: {
          x: 0.2,
          y: 0.2,
        },
      })
      .setInteractive();
    sc.on("pointerdown", () => {
      window.open("https://games.moratilla.com/simple-clicker/", "_blank");
    });
  }
}
