function createBlueShip(game) {
    var blueShip = game.add.sprite(game.world.centerX, game.world.height - 50, 'ship_blue');
    blueShip.name = "Blue Ship";
    blueShip.anchor.setTo(0.5, 0.5);
    blueShip.smoothed = false;
    blueShip.collideWorldBounds = true;
    blueShip.scale.setTo(4, 4);
    blueShip.hp = 3;

    return blueShip;
}

function createRedShip(game) {
    var redShip = game.add.sprite(game.world.centerX, 50, 'ship_red_sprite');
    redShip.name = "Red Ship";
    redShip.anchor.setTo(0.5, 0.5);
    redShip.smoothed = false;
    redShip.scale.setTo(1, 1);
    redShip.angle = 180;
    redShip.hp = 3;

    redShip.animations.add('engine');
    redShip.animations.play('engine', 250, true);

    return redShip;
}