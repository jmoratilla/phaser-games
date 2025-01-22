import { Scene } from "phaser";

export class MemoryCircles extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  circles: Phaser.GameObjects.Group;
  level: Number;

  constructor() {
    super("MemoryCircles");
  }

  create() {
    this.camera = this.cameras.main;
    this.background = this.add.image(512, 384, "background");
    this.camera.setBackgroundColor(0x0000ff);

    // Level 0: initialization
    this.circles = this.add.group();
    this.level = 0;

    // Create an array of 3 initial circles
    for (let i = 0; i < 3; i++) {
      // Each circle has a different color, position and radius
      let circle: Phaser.GameObjects.Graphics = this.add
        .circle(
          Phaser.Math.Between(100, 924),
          Phaser.Math.Between(100, 668),
          Phaser.Math.Between(10, 50),
          Phaser.Display.Color.RandomRGB().color,
        )
        .setInteractive();
      circle.setDataEnabled();
      circle.data.set("level", this.level);
      // Add the circle to the scene
      this.circles.add(circle);
    }

    this.newLevel();

    // Wait until the user clicks on one circle
    // If the user clicks on the new circle, add a new one after 3 seconds
    // If the user clicks on the wrong circle, end the game, show a message, and restart the game after the user clicks on the screen
    this.input.on(
      "gameobjectdown",
      (pointer: Phaser.Input.Pointer, circle: Phaser.GameObjects.Graphics) => {
        if (
          circle.data.get("level") != null &&
          circle.data.get("level") == this.level
        ) {
          this.sound.play("ding");
          this.newLevel();
        } else {
          this.registry.set("level", this.level);
          this.input.once("pointerdown", () => {
            this.scene.start("GameOver");
          });
        }
      },
    );
  }

  newLevel() {
    // Level 1
    // After 3 seconds, black the screen
    // Hide all the circles
    // and create a new one, showing all the circles to the user
    this.level++;
    this.camera.fadeOut(1000, 0, 0, 0);
    this.time.addEvent({
      delay: 3000,
      callback: () => {
        let circle: Phaser.GameObjects.Graphics = this.add
          .circle(
            Phaser.Math.Between(100, 924),
            Phaser.Math.Between(100, 668),
            Phaser.Math.Between(10, 50),
            Phaser.Display.Color.RandomRGB().color,
          )
          .setInteractive();
        circle.setDataEnabled();
        circle.data.set("level", this.level);
        this.circles.add(circle);
        this.camera.fadeIn(1000, 0, 0, 0);
      },
    });
  }
}
