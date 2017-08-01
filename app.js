var xbox = require('xbox-controller-node');
var Cylon = require('cylon');

Cylon.robot({
  connections: {
    bluetooth: { adaptor: 'central', uuid: 'fdfd6ea8f161', module: 'cylon-ble' }
  },

  devices: {
    bb8: { driver: 'bb8', module: 'cylon-sphero-ble' }
  },

  work: function(my) {

    var direction = {
        'up': 0,
        'down': 179,
        'left': 269,
        'right': 89
    };

    var defaultSpeed = 150;
    var speed = defaultSpeed;
    var chdSpeed = 100;
    var speedIncr = 10;
    var maxSpeed = 250;

    var color = 0x3CFF42;
    my.bb8.color(color);

    var setDirection = function(newDirection) {
        my.bb8.roll(chdSpeed, newDirection);
        after(500, function() {
            my.bb8.stop(function() {
                my.bb8.setHeading(newDirection);
            });
        });
    };

    // MOVE WITH LEFT STICK
    
    // UP
    xbox.on('leftstickUp', function() {
        my.bb8.roll(speed, direction.up);
    });

    xbox.on('leftstickUp:release', function() {
        my.bb8.stop();
    });

    // DOWN
    xbox.on('leftstickDown', function() {
        my.bb8.roll(speed, direction.down);
    });

    xbox.on('leftstickDown:release', function() {
        my.bb8.stop();
    });

    // LEFT
    xbox.on('leftstickLeft', function() {
        my.bb8.roll(speed, direction.left);
    });

    xbox.on('leftstickLeft:release', function() {
        my.bb8.stop();
    });

    // RIGHT
    xbox.on('leftstickRight', function() {
        my.bb8.roll(speed, direction.right);
    });

    xbox.on('leftstickRight:release', function() {
        my.bb8.stop();
    });

    // CHANGE DIRECTION WITH DPad (Directional Pad)

    // UP
    xbox.on('up', function() {
        setDirection(direction.up);
    });
    xbox.on('up:release', function() {
        my.bb8.stop();
    });

    // DOWN
    xbox.on('down', function() {
        setDirection(direction.down);
    });
    xbox.on('down:release', function() {
        my.bb8.stop();
    });

    // RIGHT
    xbox.on('right', function() {
        setDirection(direction.right);
    });
    xbox.on('right:release', function() {
        my.bb8.stop();
    });

    // LEFT
    xbox.on('left', function() {
        setDirection(direction.left);
    });
    xbox.on('left:release', function() {
        my.bb8.stop();
    });

    // SPEED SETTING
    xbox.on('a', function() {
        speed = defaultSpeed;
        color = 0x3CFF42;
        my.bb8.color(color);
    });

    xbox.on('b', function() {
        speed = maxSpeed;
        color = 0xFF0000;
        my.bb8.color(color);
    });

    xbox.on('x', function() {
        speed = chdSpeed;
        color = 0x00FFFF;
        my.bb8.color(color);
    });

    xbox.on('y', function() {
        speed = 200;
        color = 0xFF9000;
        my.bb8.color(color);
    });

    // PULSE
    var black = 0x000000;
    var colorInterval = 200;
    var blackInterval = 1000;
    var runPulse = false;
    var pulse = function(bColor) {
        if (!(runPulse == true)) {
            return false;
        }

        var nColor = color;
        var interval = blackInterval;
        
        if (!(bColor == black)) {
            nColor = black;
            interval = colorInterval;
        }

        after(interval, function() {
            my.bb8.color(nColor);
            pulse(nColor);
        });
    };

    xbox.on('start', function() {
        // start pulse
        runPulse = true;
        pulse(color);
    });

    xbox.on('back', function() {
        // end pulse
        runPulse = false;
    });
  }
}).start();