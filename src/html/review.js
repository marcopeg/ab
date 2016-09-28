
loadCards()
    .then(cards => populateCards(cards, 'pros'))
    .then(cards => populateCards(cards, 'cons'))
    .catch(e => console.error(e));

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

    return $card;
}

function fill($target, field, value) {
    $target.find('[data-field=' + field + ']').text(value);
}
