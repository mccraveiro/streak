// The panel handlers
var panels = [null, null];

// The arrow handlers
var arrows = [null, null];

// The names of the directions
var names = ['left', 'up', 'right', 'down'];

// Direction animations
var positions = [
    {x: '100%', y: '0'},
    {x: '0', y: '100%'},
    {x: '-100%', y: '0'},
    {x: '0', y: '-100%'}
];

// The number of rounds elapsed
var rounds = 0;

// The number of right pressed panels
var right = 0;

// The number of remaining lives
var lives = 5;

// The time (ms) that panels are going to come and are
// going to awaits to be dismissed
var fall_time = 700, press_time = 3000;

// The timer handler
var timer = null;

// Whether or not the player paused the game
var paused = false;

// Whether or not the game is active
var playing = false;

// A flag to determine whether or not the player 
// can press the key
var allowed = false;

// The direction to be pressed
var expected = 0;

// The panel being displayed
var current = 1;

// The axis of the mouse of the player (when pressed for dragging)
var axis_x, axis_y;

// The window size
var W, H;

// Function that returns the panel tag itself
function getPanel (preset) {
    return '<section class="preset-' + preset + '" id="panel-' + (n++) + '"><i></i></section>'
}

// The function that deals with losing lp
function wrong () {
    $('.lives i:nth-child(' + lives + ')').removeClass().addClass('icon-circle-empty')

    clearTimeout(timer);

    if (--lives === 0) {
        clearTimeout(timer);
        panels[0].fadeOut();
        panels[1].fadeOut();
        $('.lives').fadeOut();
        playing = false;
        return;
    }

    game();
}

// The unstack function which evaluates a key pressed
function evaluate (key) {
    key -= 37;

    if (key < 0 || key > 3 || !allowed)
        return;

    if (key !== expected)
        return wrong();

    $('#counter').html(++right);

    clearTimeout(timer);

    arrows[current].addClass('correct');

    game();
}

// Updates the difficulty of the game
function difficulty () {
    press_time -= 50;
    press_time = Math.max(press_time, 100);
}

// Returns the direction (37 - 40) when dragged
function dragDirection (x1, x2, y1, y2) {
    var delta_x = Math.abs(x2 - x1);
    var delta_y = Math.abs(y2 - y1);

    if (delta_x < W * 0.1 && delta_y < H * 0.1)
        return -1;

    if (delta_x > delta_y)
        return x2 > x1 ? 39 : 37;

    return y2 > y1 ? 40 : 38;
}

// The game function which places the tiles and is recursively called
function game () {
    if (!playing || paused)
        return;

    rounds++;

    difficulty();

    allowed = false;

    var next = current ^ 1;

    panels[current].css('z-index', 0);
    panels[next].css('z-index', 1);

    panels[next].removeClass().addClass('preset-' + (rounds % 5));

    var direction = ~~(Math.random() * 4);
    current = next;

    arrows[current].removeClass().addClass('icon-' + names[direction] + '-open');

    expected = direction;

    var pos = positions[direction];

    panels[current].css({left: pos.x, top: pos.y});

    panels[current].animate({left: 0, top: 0}, fall_time, function () {
        allowed = true;

        panels[(current ^ 1)].css('top', '-100%');

        clearTimeout(timer);

        timer = setTimeout(wrong, press_time);
    });
}

// Let the games begin!
$(document).ready(function() {
    $('section').mousedown(function (e) {
        axis_x = e.pageX;
        axis_y = e.pageY;
    });

    $('section').mouseup(function (e) {
        evaluate(dragDirection(axis_x, e.pageX, axis_y, e.pageY));
    });


    window.addEventListener('focus', function () {
        paused = false;
        game();
    });

    window.addEventListener('blur', function () {
        paused = true;
        clearTimeout(timer);
    });

    panels[0] = $('#panel-0');
    panels[1] = $('#panel-1');

    arrows[0] = $('#panel-0 i');
    arrows[1] = $('#panel-1 i');

    W = panels[0].width();
    H = panels[0].height();

    $('body').keydown(function (e) {
        evaluate(e.keyCode);
    });

    $('h1').animate({'margin-top': '10%'}, 'slow', function () {
        $('.txt').fadeIn();
        $('.txt a').click(function(){
            $('.lives i').removeClass().addClass('icon-circle');

            $('h2').html('0');

            $('h2').fadeIn();
            $('.lives').fadeIn();

            fall_time = 700;
            press_time = 3000;
            rounds = 0;
            lives = 5;

            panels[0].fadeIn();
            panels[1].fadeIn();

            panels[0].css({top: '-100%', left: '-100%'});
            panels[1].css({top: '-100%', left: '-100%'});

            playing = true;
            game();
        });
    });
});