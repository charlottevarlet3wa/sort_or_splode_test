export default class Element extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, color) {
    super(scene, x, y, "element");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setInteractive();
    this.defaultFillColor = color;
    this.setTint(color); // Apply color as tint

    // Set initial random velocity
    this.body.setBounce(1, 1); // Make it bounce off surfaces
    this.body.setCollideWorldBounds(true); // Bounce off canvas borders
    this.body.setVelocity(
      Phaser.Math.Between(-100, 100),
      Phaser.Math.Between(-100, 100)
    );

    // Track dragging state
    this.isDragging = false;
    scene.input.setDraggable(this);
  }

  startDragging() {
    this.isDragging = true;
    this.body.setVelocity(0, 0); // Stop movement while dragging
  }

  stopDragging() {
    this.isDragging = false;
    // Resume with random velocity on release
    this.body.setVelocity(
      Phaser.Math.Between(-100, 100),
      Phaser.Math.Between(-100, 100)
    );
  }

  handleZoneCollision(zone) {
    const bounds = zone.sprite.getBounds();
    if (this.x <= bounds.left || this.x >= bounds.right) {
      this.body.setVelocityX(-this.body.velocity.x);
    }
    if (this.y <= bounds.top || this.y >= bounds.bottom) {
      this.body.setVelocityY(-this.body.velocity.y);
    }
  }

  resetColor() {
    this.clearTint();
    this.setTint(this.defaultFillColor); // Reset tint to original color
  }
}
