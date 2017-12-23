var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'game_container', { preload: preload, create: create,  update: update});

var blueShip;
var redShip;
var cursors;
var blueBullets;
var blueBulletTime = 0;
var redBullets;
var redBulletTime = 0;
var explosions;

function preload () {
    game.load.image('logo', 'phaser.png');
    game.load.image('ship_blue', 'sprites/space_ship_blue.png');
    game.load.image('ship_red', 'sprites/space_ship_red.png');
    game.load.image('bullet_blue', 'sprites/bullet_blue.png');
    game.load.image('bullet_red', 'sprites/bullet_red.png');
    game.load.image('explosion', 'sprites/explosion.png');
}

function create () {
    // var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
    // logo.anchor.setTo(0.5, 0.5);

    game.physics.setBoundsToWorld();
    blueBullets = game.add.group();
    blueBullets.enableBody = true;
    blueBullets.physicsBodyType = Phaser.Physics.ARCADE;

    for (var i = 0; i < 20; i++)
    {
        var b = blueBullets.create(0, 0, 'bullet_blue');
        b.name = 'bullet_blue_' + i;
        b.exists = false;
        b.visible = false;
        b.checkWorldBounds = true;
        b.anchor.setTo(0.5, 0.5);
        b.events.onOutOfBounds.add(resetBullet, this);
    }

    redBullets = game.add.group();
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

    blueShip = game.add.sprite(game.world.centerX, 718, 'ship_blue');
    blueShip.anchor.setTo(0.5, 0.5);
    blueShip.smoothed = false;
    blueShip.collideWorldBounds = true;
    blueShip.scale.setTo(4, 4);
    blueShip.hp = 5;
    
    redShip = game.add.sprite(game.world.centerX, 50, 'ship_red');
    redShip.anchor.setTo(0.5, 0.5);
    redShip.smoothed = false;
    redShip.scale.setTo(4, 4);
    redShip.angle = 180;
    redShip.hp = 5;

    game.physics.enable(blueShip, Phaser.Physics.ARCADE);
    game.physics.enable(redShip, Phaser.Physics.ARCADE);

    explosions = game.add.group();
    explosions.enableBody = true;
    explosions.physicsBodyType = Phaser.Physics.ARCADE;

    for(var i = 0; i < 10; i++) {
        var e = explosions.create(0, 0, 'explosion');
        e.name = 'explosion_' + i;
        e.exists = false;
        e.visible = false;
        e.anchor.setTo(0.5, 0.5);
    }

    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.A, Phaser.Keyboard.D ]);
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.P, Phaser.Keyboard.B ]);
}

function update() {

    // As we don't need to exchange any velocities or motion we can the 'overlap' check instead of 'collide'
    game.physics.arcade.overlap(blueBullets, redBullets, bulletCollisionHandler, null, this);
    game.physics.arcade.overlap(blueBullets, redShip, shipHit, null, this);
    game.physics.arcade.overlap(redBullets, blueShip, shipHit, null, this);

    blueShip.body.velocity.x = 0;
    blueShip.body.velocity.y = 0;
    redShip.body.velocity.x = 0;
    redShip.body.velocity.y = 0;

    if (cursors.left.isDown && blueShip.x > 32) {
        blueShip.body.velocity.x = -300;
    } else if (cursors.right.isDown && blueShip.x < game.width - 32) {
        blueShip.body.velocity.x = 300;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.A) && redShip.x > 32) {
        redShip.body.velocity.x = -300;
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.D) && redShip.x < game.width - 32) {
        redShip.body.velocity.x = 300;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.P)) {
        fireBlueBullet();
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.B)) {
        fireRedBullet();
    }
}

function fireBlueBullet () {

    if (game.time.now > blueBulletTime)
    {
        bullet = blueBullets.getFirstExists(false);

        if (bullet)
        {
            bullet.reset(blueShip.x, blueShip.y);
            bullet.body.velocity.y = -500;
            blueBulletTime = game.time.now + 250;
        }
    }

}

function fireRedBullet () {

    if (game.time.now > redBulletTime) {
        bullet = redBullets.getFirstExists(false);

        if (bullet) {
            bullet.reset(redShip.x, redShip.y);
            bullet.body.velocity.y = 500;
            redBulletTime = game.time.now + 250;
        }
    }

}

function shipHit (ship, bullet) {
    
    explosion = explosions.getFirstExists(false);
    
    explosion.reset((bullet.x + ship.x) / 2, (bullet.y + ship.y) / 2);

    game.time.events.add(200, resetExplosion, this, explosion);

    bullet.kill();
    ship.hp--;

    if (ship.hp === 0) {
        ship.kill();
    }
}

function resetBullet (bullet) {

    bullet.kill();

}

function bulletCollisionHandler (bullet1, bullet2) {
    explosion = explosions.getFirstExists(false);
    
    explosion.reset((bullet1.x + bullet2.x) / 2, (bullet1.y + bullet2.y) / 2);

    game.time.events.add(200, resetExplosion, this, explosion);

    bullet1.kill();
    bullet2.kill();
}

function resetExplosion(explosion) {
    explosion.kill();
}