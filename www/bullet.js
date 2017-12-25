function createBlueBulletCollection(game) {
    var blueBullets = game.add.group();
    blueBullets.enableBody = true;
    blueBullets.physicsBodyType = Phaser.Physics.ARCADE;

    for (var i = 0; i < 20; i++) {
        var b = blueBullets.create(0, 0, 'bullet_blue');
        b.name = 'bullet_blue_' + i;
        b.exists = false;
        b.visible = false;
        b.checkWorldBounds = true;
        b.anchor.setTo(0.5, 0.5);
        b.events.onOutOfBounds.add(resetBullet, this);
    }

    return blueBullets;
}

function createRedBulletCollection(game) {
    var redBullets = game.add.group();
    redBullets.enableBody = true;
    redBullets.physicsBodyType = Phaser.Physics.ARCADE;

    for (var i = 0; i < 20; i++)
    {
        var b = redBullets.create(0, 0, 'bullet_red');
        b.angle = 180;
        b.name = 'bullet_red_' + i;
        b.exists = false;
        b.visible = false;
        b.checkWorldBounds = true;
        b.anchor.setTo(0.5, 0.5);
        b.events.onOutOfBounds.add(resetBullet, this);
    }

    return redBullets;
}

function resetBullet (bullet) {
    bullet.kill();
}