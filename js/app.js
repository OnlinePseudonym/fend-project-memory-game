$('.deck').css("pointer-events","none");
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

let c = 0;
let matches = 0;
let myTimer;
let timeString = "";
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
    hideCards();
    $('.deck').children().removeClass('match');
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
    };

    return array;
};

$('.start').click(function() {
    clearInterval(myTimer);
    myTimer = setInterval(function() { timer() }, 1000);
    $('.deck').css("pointer-events","auto");
});

$('.restart').click(function() {
    restart();
});

$('.yesBtn').click(function() {
    $('.modal').css("display","none");
    $('.timer').text("00:00");
    restart();
    $('.deck').css("pointer-events","none");

});

$('.noBtn').click(function() {
    $('.modal').css("display","none");
})
/*c
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
                matches++;
                increaseCount();
                if (matches === 8){
                    clearInterval(myTimer);
                    win();
                };
            } else {
                noMatch();
                openCards = [];
                increaseCount();
                setTimeout(hideCards,1000);
            };
        } else {
          addCard(this);
        };
    };
});

function showCard(card) {
    $(card).addClass('open show');
};;

function hideCards() {
    $('.deck').children().removeClass('open show').removeClass('noMatch');
    $('.deck').css("pointer-events","auto");
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

function noMatch() {
    $('.deck').find('.open').each(function() {
      if ($(this).attr('class') === 'card open show') {
          $(this).removeClass('open show').addClass('noMatch');
          $('.deck').css("pointer-events","none");
      };
  });
};

function checkMatch(array) {
    if (array[0] === array[1]) {
        return true;
    } else {
        return false;
    };
};

function increaseCount() {
    count = parseInt($('.moves').text());
    count += 1;
    count = count.toString();
    $('.moves').text(count);
};

function resetCount() {
    $('.moves').text('0');
};

function restart() {
    refreshDeck(deck);
    resetCount();
    openCards = [];
    c = 0;
    matches = 0;
};

function timer() {
    let m, s;
    c++;
    if (c > 3600){
      $('.timer').text('TIMEOUT');
      clearInterval(myTimer);
    } else {
      m = Math.floor(c/60);
      s = c%60;
    };
    if (m/10 >= 1){
      if (s/10 >= 1){
        timeString = m.toString()+':'+s.toString();
      } else{
        timeString = m.toString()+':0'+s.toString();
      };
    } else{
      if (s/10 >= 1){
        timeString = '0'+m.toString()+':'+s.toString();
      } else {
        timeString = '0'+m.toString()+':0'+s.toString();
      };
    };
    $('.timer').text(timeString);
};

function win() {
    $('.congratulations').html('Congratulations! <br/>You won in '+ timeString
        +'!<br/>Would you like to play again?')
    $('.modal').css("display","block");

};
