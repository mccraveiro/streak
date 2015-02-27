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
var lives = 3;

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

// Function that returns the panel tag itself
function getPanel (preset) {
    return '<section class="preset-' + preset + '" id="panel-' + (n++) + '"><i></i></section>'
}

// The function that deals with losing lp
function wrong () {
    arrows[current].removeClass().addClass('icon-cancel');
    // panels[current].removeClass().addClass('preset-error');

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
    if (!playing || paused || !allowed)
        return;

    key -= 37;

    if (key < 0 || key > 3)
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

    fall_time -= 5;
    fall_time = Math.max(fall_time, 200);    
}

// Generates a number in [0, 4]
function rand () {
    return ~~(Math.random() * 4);
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

    var direction = rand();

    current = next;

    arrows[current].removeClass().addClass('icon-' + names[direction] + '-open');

    expected = direction;

    var pos = positions[rand()];

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

    Hammer(document.getElementById('panel-0')).on('swiperight', function(e) {
        console.log(e);
    });

    Hammer(document.getElementById('panel-1')).on('swiperight', function(e) {
        console.log(e);
    });

    // $('section').hammer({threshold: 50}).bind('panleft', function (e) {
    //     e.preventDefault();
    //     evaluate(37);
    // });

    // $('section').hammer({threshold: 5}).bind('panup', function (e) {
    //     console.log('up ' + expected + ' ' + (1));
    //     e.preventDefault();
    //     evaluate(38);
    // });

    // $('section').hammer({threshold: 50}).bind('panright', function (e) {
    //     e.preventDefault();
    //     evaluate(39);
    // });

    // $('section').hammer({threshold: 5}).bind('pandown', function (e) {
    //     console.log('down ' + expected + ' ' + (3));
    //     e.preventDefault();
    //     evaluate(40);
    //});
    
    $('.txt a').click(function(){
        $('.lives i').removeClass().addClass('icon-circle');

        $('h2').html('0');

        $('h2').fadeIn();
        $('.lives').fadeIn();

        fall_time = 700;
        press_time = 3000;
        rounds = 0;
        lives = 3;
        right = 0;

        panels[0].fadeIn();
        panels[1].fadeIn();

        panels[0].css({top: '-100%', left: '-100%'});
        panels[1].css({top: '-100%', left: '-100%'});

        playing = true;
        game();
    });
});