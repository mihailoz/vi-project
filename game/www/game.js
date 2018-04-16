var game = new Phaser.Game('100', '100', Phaser.AUTO, 'game_container', { preload: preload, create: create,  update: update});

var blueShip;
var redShip;
var cursors;
var blueBullets;
var blueBulletTime = 0;
var redBullets;
var redBulletTime = 0;
var explosions;
var winner;
var winnerBanner;
var restartText;
var headlineBanner;
var startText;
var blueHPBars;
var redHPBars;
var status = 'started';
var isOpen = false;

function preload () {
    game.load.image('logo', 'phaser.png');
    game.load.image('ship_blue', 'sprites/space_ship_blue.png');
    game.load.image('ship_red', 'sprites/red_ship.png');
    game.load.image('bullet_blue', 'sprites/bullet_blue.png');
    game.load.image('bullet_red', 'sprites/bullet_red.png');
    game.load.spritesheet('explosion', 'sprites/explosion.png', 16, 16);
    game.load.spritesheet('ship_red_sprite', 'sprites/red_ship_sprite.png', 92, 64);
    game.load.image('healthbar', 'sprites/health_bar.png');
}

function create () {
    // var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
    // logo.anchor.setTo(0.5, 0.5);

    openGame();

    game.physics.setBoundsToWorld();

    redHPBars = createRedHPBars(game);
    blueHPBars = createBlueHPBars(game);

    blueBullets = createBlueBulletCollection(game);
    redBullets = createRedBulletCollection(game);

    blueShip = createBlueShip(game);
    redShip = createRedShip(game);

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
        e.animations.add('explode', null, 20, false);
    }

    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.A, Phaser.Keyboard.D ]);
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.ENTER ]);
}

function restartGame() {
    var xr = Math.random() * game.world.width;

    if(xr < 100)
      xr += 100;
    if(xr >= game.world.width - 100)
      xr -= 100;

    redShip.reset(xr, 50);

    var xb = Math.random() * game.world.width;

    if(xb < 100)
      xb += 100;
    if(xb >= game.world.width - 100)
      xb -= 100;

    blueShip.reset(xb, game.world.height - 50);
    blueShip.angle = 0;
    redShip.angle = 180;
    redHPBars.reset();
    blueHPBars.reset();

    redShip.hp = 3;
    blueShip.hp = 3;

    winner = undefined;
    winnerBanner.kill();
    restartText.kill();

    status = 'running';
}

function update() {
    if(status === 'started'){
        if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
            headlineBanner.kill();
            startText.kill();
            isOpen = true;
        }
    }

    if(status === 'finished') {
        if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
            restartGame();
        }
    } else {
        gameRunningUpdate();
    }
}

function gameRunningUpdate () {
    game.physics.arcade.overlap(blueBullets, redBullets, bulletCollisionHandler, null, this);
    game.physics.arcade.overlap(blueBullets, redShip, shipHit, null, this);
    game.physics.arcade.overlap(redBullets, blueShip, shipHit, null, this);
    game.physics.arcade.overlap(redShip, blueShip, shipSuicide, null, this);



    if(isOpen) {
        game.physics.arcade.accelerationFromRotation(blueShip.rotation - 0.5 * 3.14, 200, blueShip.body.velocity);
        game.physics.arcade.accelerationFromRotation(redShip.rotation - 0.5 * 3.14, 200, redShip.body.velocity);

        if (cursors.left.isDown) {
            blueShip.body.angularVelocity = -300;
        } else if (cursors.right.isDown) {
            blueShip.body.angularVelocity = 300;
        } else {
            blueShip.body.angularVelocity = 0;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            fireBlueBullet();
        }

        sendGameData(createGameData());
    }
}

function updateRedShip(actions) {
    game.physics.arcade.accelerationFromRotation(redShip.rotation - 0.5 * 3.14, 200, redShip.body.velocity);

    if (actions.fire) {
        fireRedBullet();
    }

    if (actions.left) {
        redShip.body.angularVelocity = -300;
    } else if (actions.right) {
        redShip.body.angularVelocity = 300;
    } else {
        redShip.body.angularVelocity = 0;
    }
}

function fireBlueBullet () {
    if (game.time.now > blueBulletTime)
    {
        bullet = blueBullets.getFirstExists(false);

        if (bullet)
        {
            bullet.reset(blueShip.x, blueShip.y);
            bullet.rotation = blueShip.rotation;
            game.physics.arcade.velocityFromRotation(blueShip.rotation - 0.5 * 3.14, 500, bullet.body.velocity);
            blueBulletTime = game.time.now + 300;
        }
    }

}

function fireRedBullet () {

    if (game.time.now > redBulletTime) {
        bullet = redBullets.getFirstExists(false);

        if (bullet) {
            bullet.reset(redShip.x, redShip.y);
            bullet.rotation = redShip.rotation;
            game.physics.arcade.velocityFromRotation(redShip.rotation - 0.5 * 3.14, 500, bullet.body.velocity);
            redBulletTime = game.time.now + 300;
        }
    }

}

function shipHit (ship, bullet) {

    explosion = explosions.getFirstExists(false);

    explosion.reset(bullet.x, (bullet.y + ship.y) / 2);
    explosion.play('explode', null, false, true);
    explosion.scale.setTo(3, 3);

    bullet.kill();
    ship.hp--;

    if(ship.name === "Blue Ship") {
        blueHPBars.update(ship.hp);
    }

    if(ship.name === "Red Ship") {
        redHPBars.update(ship.hp);
    }

    if (ship.hp === 0) {
        ship.kill();
        explosion.reset(ship.x, ship.y);
        explosion.play('explode', null, false, true);
        explosion.scale.setTo(6, 6);

        if(ship.name === "Blue Ship") {
            finishGame("Red Ship");
        } else {
            finishGame("Blue Ship");
        }
    }
}

function shipSuicide(ship1, ship2) {
    explosion=explosions.getFirstExists(false);

    explosion.reset((ship1.x + ship2.x)/2, (ship1.y + ship2.y)/2);
    explosion.play('explode', null, false, true);
    explosion.scale.setTo(8, 8);

    ship1.kill();
    ship2.kill();

    finishGame('Tie')
}

function bulletCollisionHandler (bullet1, bullet2) {
    explosion = explosions.getFirstExists(false);

    explosion.reset((bullet1.x + bullet2.x) / 2, (bullet1.y + bullet2.y) / 2);
    explosion.play('explode', null, false, true);
    explosion.scale.setTo(2, 2);

    bullet1.kill();
    bullet2.kill();
}

function resetExplosion(explosion) {
    explosion.kill();
}

function openGame() {
    var style = { font: "bold 64px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

    headlineBanner = game.add.text(game.width / 2, game.height / 2, "Space cowboys in space", style);
    headlineBanner.anchor.setTo(0.5, 0.5);
    headlineBanner.setShadow(6, 6, 'rgba(0,0,0,0.5)', 2);

    var style2 = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

    startText = game.add.text(game.width / 2, (game.height / 2) + 100, "To start the game press enter...", style2);
    startText.anchor.setTo(0.5, 0.5);
    startText.setShadow(6, 6, 'rgba(0,0,0,0.5)', 2);

    status = 'started';
}

function finishGame(winner) {
    if(!winnerBanner) {
        var style = { font: "bold 64px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

        if(winner === 'Tie') {
            winnerBanner = game.add.text(game.width / 2, game.height / 2, "It's a tie", style);
            winnerBanner.anchor.setTo(0.5, 0.5);
            winnerBanner.setShadow(6, 6, 'rgba(0,0,0,0.5)', 2);
        } else{
            winnerBanner = game.add.text(game.width / 2, game.height / 2, "The winner is " + winner, style);
            winnerBanner.anchor.setTo(0.5, 0.5);
            winnerBanner.setShadow(6, 6, 'rgba(0,0,0,0.5)', 2);
        }
        var style2 = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

        restartText = game.add.text(game.width / 2, (game.height / 2) + 100, "To start new game press enter...", style2);
        restartText.anchor.setTo(0.5, 0.5);
        restartText.setShadow(6, 6, 'rgba(0,0,0,0.5)', 2);
    } else {
        winnerBanner.reset(game.width / 2, game.height / 2);
        if(winner === 'Tie') {
            winnerBanner.text = "It's a tie";
        } else{
            winnerBanner.text = "The winner is " + winner;
        }
        restartText.reset(game.width / 2, (game.height / 2) + 100);
    }

    redBullets.forEachAlive(function (bullet) {
        bullet.kill();
    }, this);

    blueBullets.forEachAlive(function (bullet) {
        bullet.kill();
    }, this);

    status = 'finished';
}

function createGameData() {
    var data = {
        redShip: {
            angle: redShip.body.angle,
            x: redShip.x,
            y: redShip.y,
            hp: redShip.hp
        },
        blueShip: {
            angle: blueShip.body.angle,
            x: blueShip.x,
            y: blueShip.y,
            hp: blueShip.hp
        },
        gameProperties: {
            width: game.world.width,
            height: game.world.height
        },
        redBullets: [],
        blueBullets: []
    };

    redBullets.forEachExists(function (bullet) {
        data.redBullets.push({
            x: bullet.x,
            y: bullet.y,
            angle: bullet.body.angle
        });
    });

    blueBullets.forEachExists(function (bullet) {
        data.blueBullets.push({
            x: bullet.x,
            y: bullet.y,
            angle: bullet.body.angle
        });
    });

    return JSON.stringify(data);
}
