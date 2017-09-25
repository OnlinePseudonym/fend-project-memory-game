let deck = [
    'fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt',
    'fa fa-cube', 'fa fa-anchor', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-diamond',
    'fa fa-bomb', 'fa fa-leaf', 'fa fa-bomb', 'fa fa-bolt', 'fa fa-bicycle',
    'fa fa-paper-plane-o', 'fa fa-cube'
];
let openCards = [];

let c = 0;
let matches = 0;
let myTimer;
let timeString = "";

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//function that removes classes that display cards and re-enables mouse functionality
function hideCards() {
    $('.deck').children().removeClass('open show').removeClass('noMatch');
    $('.deck').css('pointer-events', 'auto');
}

//flips selected card over
function showCard(card) {
    $(card).addClass('open show');
}

//add card to array cointaining displayed but unmatched cards
function addCard(card) {
    openCards.push($(card).children().attr('class'));
}

/**
* @description shuffles an array and assigns each element of the array to
* to the class attribute of of the html card elements
* @param [array] containing available cards in the deck
*/
function refreshDeck(array) {
    shuffle(array);
    $('.deck').children().each(function (index) {
        $(this).children().attr('class', array[index]);
    });
    hideCards();
    $('.deck').children().removeClass('match');
}

//iterate through deck and change showing cards to matched cards add 1 to matches count
function createMatch() {
    $('.deck').children().each(function () {
        if ($(this).children().attr('class') === openCards[0]) {
            $(this).removeClass('open show').addClass('match');
        }
    });
    matches += 1;
}

//iterate through deck and change showing cards to unmatched cards disable mouse
//function for 1 second then hide cards
function noMatch() {
    $('.deck').find('.open').each(function () {
        if ($(this).attr('class') === 'card open show') {
            $(this).removeClass('open show').addClass('noMatch');
            $('.deck').css('pointer-events', 'none');
            setTimeout(hideCards, 1000);
        }
    });
}

//check to see if elements of given two element array are equal
function checkMatch(array) {
    if (array[0] === array[1]) {
        return true;
    } else {
        return false;
    }
}

//increase move count and push count to dom element
function increaseCount() {
    let count = parseInt($('.moves').text());
    count += 1;
    count = count.toString();
    $('.moves').text(count);
}

//remove stars at given checkpoints according to the move counter
function removeStar() {
    if ($('.moves').text() === '14' || $('.moves').text() === '18' || $('.moves').text() === '22') {
        $('.stars').children().first().remove();
    }
}

//reset move counter
function resetCount() {
    $('.moves').text('0');
}

//reset all counters and deck to default status
function restart() {
    refreshDeck(deck);
    resetCount();
    openCards = [];
    c = 0;
    matches = 0;
    $('.stars').html('<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>');
}

/**
* @description increments 'c' counter, converts it to a mm:ss format and pushes
* it to dom element. stops at 1 hour and displays TIMEOUT text.
*/
function timerCount() {
    let m;
    let s;
    c += 1;
    if (c > 3600) {
        $('.timer').text('TIMEOUT');
        clearInterval(myTimer);
    } else {
        m = Math.floor(c / 60);
        s = c % 60;
    }
    if (m / 10 >= 1) {
        if (s / 10 >= 1) {
            timeString = m.toString() + ':' + s.toString();
        } else {
            timeString = m.toString() + ':0' + s.toString();
        }
    } else {
        if (s / 10 >= 1) {
            timeString = '0' + m.toString() + ':' + s.toString();
        } else {
            timeString = '0' + m.toString() + ':0' + s.toString();
        }
    }
    $('.timer').text(timeString);
}

// displays a popup congratulating the user and displaying the amount of time
// the game took and how many stars they accrued
function win() {
    let stars = $('.stars').children().length;
    if (stars === 1) {
        $('.congratulations').html(
            '<h2>Congratulations!</h2> <br/>You won in ' + timeString + ' with ' + stars + ' star!<br/>Would you like to play again?'
        );
    } else {
        $('.congratulations').html(
            '<h2>Congratulations!</h2> <br/>You won in ' + timeString + ' with ' + stars + ' stars!<br/>Would you like to play again?'
        );
    }
    $('.modal').css('display', 'block');
}

//when start button is clicked timer begins and mouse functionality is enabled
//clears timer to avoid multiple concurent timers if user clicks start more than once
$('.start').click(function () {
    clearInterval(myTimer);
    myTimer = setInterval(function () {
        timerCount();
    }, 1000);
    $('.deck').css('pointer-events', 'auto');
});

//clicking restart button invokes restart refreshing the board and all counters
$('.restart').click(function () {
    restart();
});

//clicking "Yes" button from within popup closes popup, resets board and counters,
//and disables mouse functionality
$('.yesBtn').click(function () {
    $('.modal').css('display', 'none');
    $('.timer').text('00:00');
    restart();
    $('.deck').css('pointer-events', 'none');
});

//clicking "no" button from within popup closes popup and returns to winning board
$('.noBtn').click(function () {
    $('.modal').css('display', 'none');
});

//clicking "x" button from within popup closes popup and returns to winning board
$('.close').click(function () {
    $('.modal').css('display', 'none');
});

/**
* @description clicking a card on the game board displays the card if it isn't
* already visable and if there is already a card in the openCards array test whether
* or not it is a match. If a match is found it matches the cards and checks whether
* or not all cards on the board are matched so it can trigger a win. The appropriate
* counters are incremented at throughout
*/
$('.card').click(function () {
    if ($(this).attr('class') !== 'card open show' && $(this).attr('class') !== 'card match') {
        showCard(this);
        if (openCards.length > 0) {
            addCard(this);
            if (checkMatch(openCards)) {
                createMatch();
                if (matches === 8) {
                    clearInterval(myTimer);
                    win();
                }
            } else {
                noMatch();
            }
            openCards = [];
            increaseCount();
            removeStar();
        } else {
            addCard(this);
        }
    }
});
