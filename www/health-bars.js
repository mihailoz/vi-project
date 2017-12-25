function createRedHPBars (game) {
    var bars = [];

    bars[0] = game.add.sprite(25, 50, 'healthbar');
    bars[0].anchor.setTo(0.5, 0.5);
    bars[0].smoothed = false;

    bars[1] = game.add.sprite(60, 50, 'healthbar');
    bars[1].anchor.setTo(0.5, 0.5);
    bars[1].smoothed = false;

    bars[2] = game.add.sprite(95, 50, 'healthbar');
    bars[2].anchor.setTo(0.5, 0.5);
    bars[2].smoothed = false;

    bars.reset = function () {
        bars[0].reset(25, 50, 'healthbar');
        bars[1].reset(60, 50, 'healthbar');
        bars[2].reset(95, 50, 'healthbar');
    }

    bars.update = function (hp) {
        if(hp < 3 && hp >= 0) {
            bars[hp].kill();
        }
    }

    return bars;
}

function createBlueHPBars (game) {
    var bars = [];

    bars[0] = game.add.sprite(game.width - 25, game.height - 50, 'healthbar');
    bars[0].anchor.setTo(0.5, 0.5);
    bars[0].smoothed = false;

    bars[1] = game.add.sprite(game.width - 60, game.height - 50, 'healthbar');
    bars[1].anchor.setTo(0.5, 0.5);
    bars[1].smoothed = false;

    bars[2] = game.add.sprite(game.width -95, game.height -50, 'healthbar');
    bars[2].anchor.setTo(0.5, 0.5);
    bars[2].smoothed = false;

    bars.reset = function () {
        bars[0].reset(game.width - 25, game.height - 50, 'healthbar');
        bars[1].reset(game.width - 60, game.height - 50, 'healthbar');
        bars[2].reset(game.width - 95, game.height - 50, 'healthbar');
    }

    bars.update = function (hp) {
        if(hp < 3 && hp >= 0) {
            bars[hp].kill();
        }
    }

    return bars;
}