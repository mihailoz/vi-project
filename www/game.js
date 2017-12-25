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
var blueHPBars;
var redHPBars;
var bluePowerBar;
var redPowerBar;
var bluePowerCounter;
var redPowerCounter;
var isRunning = true;

function preload () {
    game.load.image('logo', 'phaser.png');
    game.load.image('ship_blue', 'sprites/space_ship_blue.png');
    game.load.image('ship_red', 'sprites/red_ship.png');
    game.load.image('bullet_blue', 'sprites/bullet_blue.png');
    game.load.image('bullet_red', 'sprites/bullet_red.png');
    game.load.image('explosion', 'sprites/explosion.png');
    game.load.spritesheet('ship_red_sprite', 'sprites/red_ship_sprite.png', 92, 64);
    game.load.image('healthbar', 'sprites/health_bar.png');
    game.load.image('blue_power_bar', 'sprites/power_bar_blue.png');
    game.load.image('red_power_bar', 'sprites/power_bar_red.png');
}

function create () {
    // var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
    // logo.anchor.setTo(0.5, 0.5);

    game.physics.setBoundsToWorld();
    
    redHPBars = createRedHPBars(game);
    blueHPBars = createBlueHPBars(game);

    blueBullets = createBlueBulletCollection(game);
    redBullets = createRedBulletCollection(game);

    blueShip = createBlueShip(game);
    redShip = createRedShip(game);

    game.physics.enable(blueShip, Phaser.Physics.ARCADE);
    game.physics.enable(redShip, Phaser.Physics.ARCADE);

    bluePowerBar = [];
    redPowerBar = [];

    bluePowerCounter = 0;
    redPowerCounter = 0;

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
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.P, Phaser.Keyboard.B, Phaser.Keyboard.ENTER ]);
}

function restartGame() {
    redShip.reset(game.world.centerX, 50);
    blueShip.reset(game.world.centerX, game.world.height - 50);
    redHPBars.reset();
    blueHPBars.reset();
    
    redShip.hp = 3;
    blueShip.hp = 3;

    winner = undefined;
    winnerBanner.kill();
    restartText.kill();

    isRunning = true;
}

function update() {
    blueShip.body.velocity.x = 0;
    blueShip.body.velocity.y = 0;
    redShip.body.velocity.x = 0;
    redShip.body.velocity.y = 0;

    if(!isRunning) {
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

    if (cursors.left.isDown && blueShip.x > 32) {
        blueShip.body.velocity.x = -300;
    } else if (cursors.right.isDown && blueShip.x < game.width - 32) {
        blueShip.body.velocity.x = 300;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.A) && redShip.x > 48) {
        redShip.body.velocity.x = -300;
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.D) && redShip.x < game.width - 48) {
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

            if(bluePowerCounter < 20) {
                bluePowerBar[bluePowerCounter] = game.add.sprite(25, game.height - 25, 'blue_power_bar');
                bluePowerBar[bluePowerCounter].anchor.setTo(0.5 - bluePowerCounter, 0.5);
                bluePowerBar[bluePowerCounter].smoother = false;
                bluePowerCounter++;
            }
        }
    }

}

function fireRedBullet () {

    if (game.time.now > redBulletTime) {
        bullet = redBullets.getFirstExists(false);

        if (bullet) {
            bullet.reset(redShip.x, redShip.y + 32);
            bullet.body.velocity.y = 500;
            redBulletTime = game.time.now + 250;

            if(redPowerCounter < 20) {
                redPowerBar[redPowerCounter] = game.add.sprite(game.width - 25, 25, 'red_power_bar');
                redPowerBar[redPowerCounter].anchor.setTo(0.5 + redPowerCounter, 0.5);
                redPowerBar[redPowerCounter].smoother = false;
                redPowerCounter++;
            }
        }
    }

}

function shipHit (ship, bullet) {
    
    explosion = explosions.getFirstExists(false);
    
    explosion.reset(bullet.x, (bullet.y + ship.y) / 2);

    game.time.events.add(200, resetExplosion, this, explosion);

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
        
        if(ship.name === "Blue Ship") {
            finishGame("Red Ship");
        } else {
            finishGame("Blue Ship");
        }
    }
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

function finishGame(winner) {
    if(!winnerBanner) {
        var style = { font: "bold 64px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

        winnerBanner = game.add.text(game.width / 2, game.height / 2, "The winner is " + winner, style);
        winnerBanner.anchor.setTo(0.5, 0.5);
        winnerBanner.setShadow(6, 6, 'rgba(0,0,0,0.5)', 2);

        var style2 = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

        restartText = game.add.text(game.width / 2, (game.height / 2) + 100, "To start new game press enter...", style2);
        restartText.anchor.setTo(0.5, 0.5);
        restartText.setShadow(6, 6, 'rgba(0,0,0,0.5)', 2);
    } else {
        winnerBanner.reset(game.width / 2, game.height / 2);
        winnerBanner.text = "The winner is " + winner;
        restartText.reset(game.width / 2, (game.height / 2) + 100);
    }

    redBullets.forEachAlive(function (bullet) {
        bullet.kill();
    }, this);

    blueBullets.forEachAlive(function (bullet) {
        bullet.kill();
    }, this);

    for(i=0; i < redPowerCounter; i++) {
        redPowerBar[i].kill();
    }

    redPowerCounter = 0;

    for(i=0; i < bluePowerCounter; i++) {
        bluePowerBar[i].kill();
    }

    bluePowerCounter = 0;

    isRunning = false;
}