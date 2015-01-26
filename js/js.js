// The panel handlers
var panels = [null, null];

// The arrow handlers
var arrows = [null, null];

// The names of the directions
var names = ['left', 'up', 'right', 'down'];

// The number of rounds elapsed
var rounds = 0;

// The number of right pressed panels
var right = 0;

// The time (ms) that panels are going to come and are
// going to awaits to be dismissed
var fall_time = 700, press_time = 2000;

// The timer handler
var timer = null;

// Whether or not the player paused the game
var paused = false;

// A flag to determine whether or not the player 
// can press the key
var allowed = false;

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
    key -= 37;

    if (key < 0 || key > 3 || key !== expected || !allowed)
        return;

    right++;

    clearTimeout(timer);

    arrows[current].addClass('correct');

    game();
}

// The game function which places the tiles and is recursively called
function game () {
    if (paused)
        return;

    rounds++;

    allowed = false;

    var next = current ^ 1;

    panels[current].css('z-index', 0);
    panels[next].css('z-index', 1);

    panels[next].removeClass().addClass('preset-' + (rounds % 5));

    var direction = ~~(Math.random() * 4);
    current = next;

    arrows[current].removeClass().addClass('icon-' + names[direction] + '-open');

    expected = direction;

    panels[current].animate({top: 0}, fall_time, function () {
        allowed = true;

        panels[(current ^ 1)].css('top', '-100%');

        clearTimeout(timer);

        timer = setTimeout(function () {
            game();
        }, press_time);
    });
}

// Let the games begin!
$(document).ready(function() {
    window.addEventListener('focus', function() {
        paused = false;
        game();
    });

    window.addEventListener('blur', function() {
        paused = true;
        clearTimeout(timer);
    });

    panels[0] = $('#panel-0');
    panels[1] = $('#panel-1');

    arrows[0] = $('#panel-0 i');
    arrows[1] = $('#panel-1 i');

    $('body').keydown(function (e) {
        evaluate(e.keyCode);
    });

    game();
});