
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
    var $card = $($('#card-template').html());
    $card.text(card.text);
    return $card;
}
