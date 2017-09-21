/*
 * Create a list that holds all of your cards
 */
let deck = [
    'fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt',
    'fa fa-cube', 'fa fa-anchor', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-diamond',
    'fa fa-bomb', 'fa fa-leaf', 'fa fa-bomb', 'fa fa-bolt', 'fa fa-bicycle',
    'fa fa-paper-plane-o', 'fa fa-cube'
];
let openCards = [];
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
 function refreshDeck(array) {
    shuffle(array);
    const cards = $('.deck');
    cards.children().each(function(index) {
        $(this).children().attr('class',array[index]);
    });
 };

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

$('.restart').click(function() {
    refreshDeck(deck);
});
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

$('.card').click(function() {
    if ($(this).attr('class')!='card open show' && $(this).attr('class')!='card match'){
        showCard(this);
        if (openCards.length > 0) {
            addCard(this);
            if (checkMatch(openCards)) {
                createMatch();
                openCards = [];
                increaseCount();
            } else {
                openCards = [];
                increaseCount();
                hideCards();
            };
        } else {
          addCard(this);
        };
    };
});

function showCard(card) {
    $(card).addClass('open show');
};

function hideCards() {
    $('.deck').children().removeClass('open show');
};

function addCard(card) {
    openCards.push($(card).children().attr('class'));
};

function createMatch() {
    $('.deck').children().each(function() {
        if ($(this).children().attr('class') === openCards[0]) {
            $(this).removeClass('open show').addClass('match');
        };
    });
};

function checkMatch(array) {
    if (array[0] === array[1]) {
        return true;
    } else {
        return false;
    }
};

function increaseCount() {
    count = parseInt($('.moves').text());
    count += 1;
    count = count.toString();
    $('.moves').text(count);
}
