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
var blueHPBar1;
var blueHPBar2;
var blueHPBar3;
var redHPBar1;
var redHPBar2;
var redHPBar3;

function preload () {
    game.load.image('logo', 'phaser.png');
    game.load.image('ship_blue', 'sprites/space_ship_blue.png');
    game.load.image('ship_red', 'sprites/red_ship.png');
    game.load.image('bullet_blue', 'sprites/bullet_blue.png');
    game.load.image('bullet_red', 'sprites/bullet_red.png');
    game.load.image('explosion', 'sprites/explosion.png');
    game.load.spritesheet('ship_red_sprite', 'sprites/red_ship_sprite.png', 92, 64);
    game.load.image('healthbar', 'sprites/health_bar.png');
}

function create () {
    // var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
    // logo.anchor.setTo(0.5, 0.5);

    game.physics.setBoundsToWorld();
    blueBullets = game.add.group();
    blueBullets.enableBody = true;
    blueBullets.physicsBodyType = Phaser.Physics.ARCADE;

    redHPBar1 = game.add.sprite(25, 50, 'healthbar');
    redHPBar1.anchor.setTo(0.5, 0.5);
    redHPBar1.smoothed = false;

    redHPBar2 = game.add.sprite(60, 50, 'healthbar');
    redHPBar2.anchor.setTo(0.5, 0.5);
    redHPBar2.smoothed = false;

    redHPBar3 = game.add.sprite(95, 50, 'healthbar');
    redHPBar3.anchor.setTo(0.5, 0.5);
    redHPBar3.smoothed = false;

    blueHPBar1 = game.add.sprite(game.width - 25, game.height - 50, 'healthbar');
    blueHPBar1.anchor.setTo(0.5, 0.5);
    blueHPBar1.smoothed = false;

    blueHPBar2 = game.add.sprite(game.width - 60, game.height - 50, 'healthbar');
    blueHPBar2.anchor.setTo(0.5, 0.5);
    blueHPBar2.smoothed = false;

    blueHPBar3 = game.add.sprite(game.width -95, game.height -50, 'healthbar');
    blueHPBar3.anchor.setTo(0.5, 0.5);
    blueHPBar3.smoothed = false;

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

    blueShip = game.add.sprite(game.world.centerX, game.world.height - 50, 'ship_blue');
    blueShip.name = "Blue Ship";
    blueShip.anchor.setTo(0.5, 0.5);
    blueShip.smoothed = false;
    blueShip.collideWorldBounds = true;
    blueShip.scale.setTo(4, 4);
    blueShip.hp = 3;

    
    redShip = game.add.sprite(game.world.centerX, 50, 'ship_red_sprite');
    redShip.name = "Red Ship";
    redShip.anchor.setTo(0.5, 0.5);
    redShip.smoothed = false;
    redShip.scale.setTo(1, 1);
    redShip.angle = 180;
    redShip.hp = 3;

    redShip.animations.add('engine');
    redShip.animations.play('engine', 250, true);

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
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.P, Phaser.Keyboard.B, Phaser.Keyboard.ENTER ]);
}

function restartGame() {
    redShip.reset(game.world.centerX, 50);
    blueShip.reset(game.world.centerX, game.world.height - 50);
    redHPBar1.reset(25, 50, 'healthbar');
    redHPBar2.reset(60, 50, 'healthbar');
    redHPBar3.reset(95, 50, 'healthbar');
    blueHPBar1.reset(game.width - 25, game.height - 50, 'healthbar');
    blueHPBar2.reset(game.width - 60, game.height - 50, 'healthbar');
    blueHPBar3.reset(game.width - 95, game.height - 50, 'healthbar');
    
    redShip.hp = 3;
    blueShip.hp = 3;

    winner = undefined;
    winnerBanner.kill();
    restartText.kill();
}

function update() {
    blueShip.body.velocity.x = 0;
    blueShip.body.velocity.y = 0;
    redShip.body.velocity.x = 0;
    redShip.body.velocity.y = 0;

    if(winner) {
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
        if(ship.hp === 2) {
            blueHPBar3.kill();
        } else if(ship.hp === 1){
            blueHPBar2.kill();
        } else{
            blueHPBar1.kill();
        }
    }

    if(ship.name === "Red Ship") {
        if(ship.hp === 2) {
            redHPBar3.kill();
        } else if(ship.hp === 1){
            redHPBar2.kill();
        } else{
            redHPBar1.kill();
        }
    }

    if (ship.hp === 0) {
        ship.kill();
        
        if(ship.name === "Blue Ship") {
            winner = "Red Ship";
        } else {
            winner = "Blue Ship";
        }
    }
}

function resetBullet (bullet) {
    console.log("OUT OF BOUNDS", bullet);
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