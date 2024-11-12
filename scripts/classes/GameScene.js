import Element from "./Element.js";
import DropZone from "./DropZone.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.image("element", "path/to/your/element.png"); // Load the element sprite
    this.load.image("zone", "path/to/your/zone.png"); // Load the zone sprite
  }

  create() {
    this.score = 0;
    this.scoreDisplay = document.getElementById("score");
    this.elements = [];

    // Initialize drop zones with sprites
    this.redZone = new DropZone(this, 300, 100, 0xff0000);
    this.greenZone = new DropZone(this, 300, 220, 0x00ff00);

    // Spawn the first element
    this.spawnElement();

    // Set up drag and drop events
    this.input.on("dragstart", (pointer, gameObject) => {
      gameObject.getData("element").startDragging(); // Retrieve Element object
      gameObject.setTint(0xaaaaaa);
    });

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on("dragend", (pointer, gameObject) => {
      gameObject.getData("element").stopDragging(); // Stop dragging
      gameObject.getData("element").resetColor(); // Reset color
      this.handleDrop(gameObject.getData("element"));
    });
  }

  update() {
    this.elements.forEach((element) => {
      if (!element.isDragging) {
        element.handleZoneCollision(this.redZone);
        element.handleZoneCollision(this.greenZone);
      }
    });
  }

  spawnElement() {
    const color = Math.random() < 0.5 ? 0xff0000 : 0x00ff00;
    const element = new Element(this, 50, 100, color);
    element.setData("element", element);
    element.targetZone = color === 0xff0000 ? this.redZone : this.greenZone;
    this.elements.push(element);
  }

  handleDrop(element) {
    if (element.targetZone.isElementInside(element)) {
      this.updateScore(1);
      element.x = element.targetZone.x;
      element.y = element.targetZone.y;
      element.setInteractive(false);
      this.spawnElement();
    } else {
      this.updateScore(-1);
      this.explode(element);
      this.clearZoneElements(this.redZone);
    }
  }

  explode(element) {
    element.destroy();
    this.spawnElement();
  }

  clearZoneElements(zone) {
    this.elements = this.elements.filter((element) => {
      if (zone.isElementInside(element)) {
        element.destroy();
        return false;
      }
      return true;
    });
  }

  updateScore(amount) {
    this.score += amount;
    this.scoreDisplay.textContent = this.score;
  }
}
