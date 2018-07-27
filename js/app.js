/*
 * Code for the memory Game
 */

const cardList = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
let started = false;
let openCards = [];
let moves = 0;
let timeCount = 0;
let solvedCount = 0;
let timerPtr;


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// get class value from card
function getClassFromCard(card){
    return card[0].firstChild.className;
}

// check cards when count = 2
function checkOpenCards(){
    if (getClassFromCard(openCards[0]) === getClassFromCard(openCards[1])){
        solvedCount++;
        openCards.forEach(function(card){
            card.animateCss('tada', function(){
                card.toggleClass("open show match");
            });
        });
    } else {
        openCards.forEach(function(card){
            card.animateCss('shake', function(){
                card.toggleClass("open show");
            });
        });
    }
    openCards = [];
    incrementMove();
    if (solvedCount === 8){
        endGame();
    }
}

// Start timer
function startTimer(){
    timeCount += 1;
    $("#timer").html(timeCount);
    timerPtr = setTimeout(startTimer, 1000);
}

// Increment count
function incrementMove(){
    moves += 1;
    $("#moves").html(moves);
    if (moves === 14 || moves === 20){
        reduceStar();
    }
}

// Event handler for card clicked
function cardClick(event){
    // Checks if match or not
    let classes = $(this).attr("class");
    if (classes.search('open') * classes.search('match') !== 1){
        return;
    }
    // Start Game
    if (!started) {
        started = true;
        timeCount = 0;
        timerPtr = setTimeout(startTimer, 1000);
    }
    // Flip cards
    if (openCards.length < 2){
        $(this).toggleClass("open show");
        openCards.push($(this));
    }
    // Match or not
    if (openCards.length === 2){
        checkOpenCards();
    }
}

// create individual card element
function createCard(cardClass){
    $("ul.deck").append(`<li class="card"><i class="fa ${cardClass}"></i></li>`);
}

//Populate Cards
function populateCards(){
    shuffle(cardList.concat(cardList)).forEach(createCard);
}

// Restart Game
function resetGame(){
    $("ul.deck").html("");
    $(".stars").html("");
    moves = -1;
    incrementMove();
    started = false;
    openCards = [];
    timeCount = 0;
    solvedCount = 0;
    clearTimeout(timerPtr);
    $("#timer").html(0);
    initGame();
}

// Start when game has begun
function endGame(){
    // stop timer
    clearTimeout(timerPtr);
    // show prompt
    let stars = $(".fa-star").length;
    vex.dialog.confirm({
        message: `Congrats! You just won the game in ${timeCount} seconds with ${stars}/3 star rating. Do you want to play again?`,
        callback: function(value){
            if (value){
                resetGame();
            }
        }
    });
}

// Initialize stars
function initStars(){
    for (let i=0; i<3; i++){
        $(".stars").append(`<li><i class="fa fa-star"></i></li>`);
    }
}

// Reduce rating
function reduceStar(){
    let stars = $(".fa-star");
    $(stars[stars.length-1]).toggleClass("fa-star fa-star-o");
}

// Initialize game
function initGame(){
    populateCards();
    initStars();
    $(".card").click(cardClick);
}

// things done after DOM is loaded for the first time
$(document).ready(function(){
    initGame();
    $("#restart").click(resetGame);
    vex.defaultOptions.className = 'vex-theme-os';
    vex.dialog.buttons.YES.text = 'Yes!';
    vex.dialog.buttons.NO.text = 'No';
});

// load animateCss
$.fn.extend({
    animateCss: function (animationName, callback) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);
            if (callback) {
                callback();
            }
        });
        return this;
    }
});
