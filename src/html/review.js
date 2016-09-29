
/**
 * Fetch Cards and initialise the board
 */


fetchCards();
$('#mergeCardsBtn').on('click', mergeCards);


/**
 * Init Sortable Behaviour
 */

$('#pros, #cons').sortable({
    connectWith: '.x-cards',
}).disableSelection();

$('#pros').on('sortupdate', updateCardsPosition('pros'));
$('#cons').on('sortupdate', updateCardsPosition('cons'));


function fetchCards() {
    $('#pros, #cons').empty();
    $('#mergeCardsBtn').fadeOut();
    loadCards()
        .then(cards => populateCards(cards, 'pros'))
        .then(cards => populateCards(cards, 'cons'))
        .catch(e => console.error(e));
}

function loadCards() {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: 'get',
            url: '/cards',
            dataType: 'json',
            error: reject,
            success: resolve,
        });
    });
}

function deleteCard(cardId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: 'delete',
            url: '/cards/' + cardId,
            dataType: 'json',
            error: reject,
            success: resolve,
        });
    });
}

function updateCard(cardId, data) {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: 'put',
            url: '/cards/' + cardId,
            contentType: 'application/json',
            data: JSON.stringify(data),
            dataType: 'json',
            error: reject,
            success: resolve,
        });
    });
}

function updateCardsPosition(type) {
    var $targetList = $('#' + type);
    return () => {
        var data = {
            type: type,
            cards: [],
        }

        $targetList.find('.x-card').each((pos, card) => {
            data.cards.push($(card).attr('data-card-id'));
        });

        $.ajax({
            method: 'put',
            url: '/cards/sort',
            contentType: 'application/json',
            data: JSON.stringify(data),
            dataType: 'json',
            error: err => console.error(err),
        });
    };
}

function mergeCards(e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).blur();

    var data = {
        cards: selectedCards,
    };

    $.ajax({
        method: 'put',
        url: '/cards/merge',
        contentType: 'application/json',
        data: JSON.stringify(data),
        dataType: 'json',
        success: () => fetchCards(),
        error: err => console.error(err),
    });
}

function populateCards(cards, type) {
    var $target = $('#' + type);

    cards
        .filter(cardTypeFilter(type))
        .map(makeCard)
        .forEach($card => $target.append($card));

    return cards;
}

function cardTypeFilter(type) {
    return card => card.type === type;
}

function makeCard(card) {
    // console.log(card);
    var $card = $($('#card-template').html());
    $card.attr('data-card-id', card._id)

    fill($card, 'content', card.text);

    // handle remove card
    $card.find('.x-card-delete').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        deleteCard(card._id)
        .then($card.fadeOut())
        .catch(err => console.error(err));
    });

    // Handle select card
    $card.on('click', toggleCardSelection)

    $card.find('select').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
    }).on('change', function(e) {
        updateCard(card._id, {
            weight: $(this).val(),
        });
    }).val(card.weight);

    return $card;
}

function fill($target, field, value) {
    $target.find('[data-field=' + field + ']').html(value.replace(/\n/g, "<br />"));
}

var selectedCards = [];

function toggleCardSelection(e) {
    e.preventDefault();
    e.stopPropagation();

    var $card = $(this);
    var cardId = $card.attr('data-card-id');

    if (selectedCards.indexOf(cardId) === -1) {
        selectedCards.push(cardId);
        $card.addClass('active');
    } else {
        selectedCards.splice(selectedCards.indexOf(cardId), 1);
        $card.removeClass('active');
    }

    if (selectedCards.length > 1) {
        $('#mergeCardsBtn').fadeIn();
    } else {
        $('#mergeCardsBtn').fadeOut();
    }
}
