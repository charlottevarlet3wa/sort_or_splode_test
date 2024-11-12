const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

let totalSpawned = 0;
let countInZoneA = 0;
let countInZoneB = 0;
let currentElement = null;
let elementVelocity = { x: 0, y: 0 };
let speed = 0.5;

function preload() {
  this.load.image("zoneA", "assets/sprites/zoneA.png");
  this.load.image("zoneB", "assets/sprites/zoneB.png");
  this.load.image("elementA", "assets/sprites/elementA.png");
  this.load.image("elementB", "assets/sprites/elementB.png");
}

function create() {
  this.zoneA = this.add.sprite(200, 300, "zoneA").setInteractive();
  this.zoneB = this.add.sprite(600, 300, "zoneB").setInteractive();

  spawnNewElement.call(this);

  this.input.keyboard.on("keydown-W", () => {
    console.log("Nombre d'éléments dans la zone A :", countInZoneA);
  });

  this.input.keyboard.on("keydown-C", () => {
    console.log("Nombre d'éléments dans la zone B :", countInZoneB);
  });

  this.input.keyboard.on("keydown-X", () => {
    console.log("Nombre total d'éléments spawnés :", totalSpawned);
  });
}

function spawnNewElement() {
  totalSpawned++;

  const elementType = Phaser.Math.Between(0, 1) === 0 ? "a" : "b";
  currentElement = this.add
    .sprite(400, 100, `element${elementType.toUpperCase()}`)
    .setInteractive({ draggable: true });

  currentElement.elementType = elementType;

  // Attribuer une vitesse aléatoire pour le mouvement
  elementVelocity.x = Phaser.Math.Between(-20, 20) / 100;
  elementVelocity.y = Phaser.Math.Between(-20, 20) / 100;

  this.input.setDraggable(currentElement);

  // Associer un événement 'dragend' uniquement pour cet élément
  currentElement.once("dragend", (pointer, gameObject) => {
    handleDrop.call(this, gameObject);
  });
}

function handleDrop(gameObject) {
  if (checkOverlap(gameObject, this.zoneA) && gameObject.elementType === "a") {
    gameObject.x = this.zoneA.x;
    gameObject.y = this.zoneA.y;
    gameObject.disableInteractive();
    countInZoneA++;
    gameObject.zone = this.zoneA;
    console.log("Correct: Element 'a' dans Zone A");
    spawnNewElement.call(this);
  } else if (
    checkOverlap(gameObject, this.zoneB) &&
    gameObject.elementType === "b"
  ) {
    gameObject.x = this.zoneB.x;
    gameObject.y = this.zoneB.y;
    gameObject.disableInteractive();
    countInZoneB++;
    gameObject.zone = this.zoneB;
    console.log("Correct: Element 'b' dans Zone B");
    spawnNewElement.call(this);
  } else {
    gameObject.x = 400;
    gameObject.y = 100;
    console.log("Incorrect! Déposez l'élément dans la zone correcte.");
  }
}

function update() {
  if (currentElement) {
    // Mouvement de l'élément
    currentElement.x += elementVelocity.x;
    currentElement.y += elementVelocity.y;

    // Rebondir contre les bords du canvas
    if (currentElement.x <= 0 || currentElement.x >= config.width) {
      elementVelocity.x *= -1;
    }
    if (currentElement.y <= 0 || currentElement.y >= config.height) {
      elementVelocity.y *= -1;
    }

    // Rebondir contre les bords extérieurs des zones de drop
    if (!currentElement.disabled) {
      bounceOffZoneEdges(currentElement, this.zoneA);
      bounceOffZoneEdges(currentElement, this.zoneB);
    } else {
      // Rebondir contre les bords intérieurs de la zone lorsqu'il est placé
      stayInsideZone(currentElement, currentElement.zone);
    }
  }
}

function bounceOffZoneEdges(element, zone) {
  const zoneBounds = zone.getBounds();
  if (
    element.x + element.width / 2 > zoneBounds.left &&
    element.x - element.width / 2 < zoneBounds.right &&
    element.y + element.height / 2 > zoneBounds.top &&
    element.y - element.height / 2 < zoneBounds.bottom
  ) {
    if (element.x <= zoneBounds.left || element.x >= zoneBounds.right) {
      elementVelocity.x *= -1;
    }
    if (element.y <= zoneBounds.top || element.y >= zoneBounds.bottom) {
      elementVelocity.y *= -1;
    }
  }
}

function stayInsideZone(element, zone) {
  const zoneBounds = zone.getBounds();
  if (element.x - element.width / 2 < zoneBounds.left) {
    element.x = zoneBounds.left + element.width / 2;
    elementVelocity.x *= -1;
  } else if (element.x + element.width / 2 > zoneBounds.right) {
    element.x = zoneBounds.right - element.width / 2;
    elementVelocity.x *= -1;
  }

  if (element.y - element.height / 2 < zoneBounds.top) {
    element.y = zoneBounds.top + element.height / 2;
    elementVelocity.y *= -1;
  } else if (element.y + element.height / 2 > zoneBounds.bottom) {
    element.y = zoneBounds.bottom - element.height / 2;
    elementVelocity.y *= -1;
  }
}

function checkOverlap(spriteA, spriteB) {
  const boundsA = spriteA.getBounds();
  const boundsB = spriteB.getBounds();
  return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
}
