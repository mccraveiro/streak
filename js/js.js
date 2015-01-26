// The panel handlers
var panels = [null, null];

// The arrow handlers
var arrows = [null, null];

// The names of the directions
var names = ['right', 'up', 'left', 'down'];

// The number of rounds elapsed
var rounds = 0;

// The time (ms) that panels are going to come and are
// going to awaits to be dismissed
var fall_time = 1000, press_time = 2000;

// The timer handler
var timer = null;

// The direction to be pressed
var expected = 0;

// The panel being displayed
var current = 1;

// Function that returns the panel tag itself
function getPanel (preset) {
    return '<section class="preset-' + preset + '" id="panel-' + (n++) + '"><i></i></section>'
}

// The unstack function which evaluates a key pressed
function evaluate (key) {
    if (key < 37 || key > 40)
        return;
}

// The game function which places the tiles and is recursively called
function game () {
    rounds++;

    var next = current ^ 1;

    panels[current].css('z-index', 0);
    panels[next].css('z-index', 1);

    panels[next].removeClass().addClass('preset-' + (rounds % 5));

    var direction = ~~(Math.random() * 4);
    current = next;

    arrows[current].removeClass().addClass('icon-' + names[direction] + '-open');

    expected = direction;

    panels[current].animate({top: 0}, fall_time, function () {
        
        panels[(current ^ 1)].css({top: '-100%'});

        setTimeout(function () {
            game();
        }, press_time);
    });
}

// Let the games begin!
$(document).ready(function() {

    panels[0] = $('#panel-0');
    panels[1] = $('#panel-1');

    arrows[0] = $('#panel-0 i');
    arrows[1] = $('#panel-1 i');

    $('body').keydown(function (e) {
        evaluate(e.keyCode);
    });

    game();
});