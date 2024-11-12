export default class DropZone extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, color) {
    super(scene, x, y, "zone");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setTint(color); // Apply color as tint
    this.setImmovable(true); // Ensure the drop zone doesn’t move
  }

  isElementInside(element) {
    return Phaser.Geom.Intersects.RectangleToRectangle(
      this.getBounds(),
      element.getBounds()
    );
  }
}
