
(function($) {

    var pid = $('body').attr('data-pid');
    var editContext = {};

    /**
     * Fetch Cards and initialise the board
     */

    fetchCards();
    $('#mergeCardsBtn').on('click', mergeCards);


    /**
     * Init Sortable Behaviour
     */

    $('#pros, #cons').sortable({
        handle: '.x-move-handle',
        connectWith: '.x-cards',
    }).disableSelection();

    $('#pros').on('sortupdate', updateCardsPosition('pros'));
    $('#cons').on('sortupdate', updateCardsPosition('cons'));


    /**
     * Init
     */

    $('body').on('keyup', function(e){
        if (e.which == 27 && editContext.$card) {
            editContext.$card.find('textarea').hide().remove();
            editContext.$card.find('.x-content-handle').show();
            editContext = {};
            return;
        }
        if (e.which == 13 && (e.metaKey || e.ctrlKey)) {
            commitEditContext();
            return;
        }
    });

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
                url: '/' + pid + '/cards',
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
                url: '/' + pid + '/cards/' + cardId,
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
                url: '/' + pid + '/cards/' + cardId,
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
                url: '/' + pid + '/cards/sort',
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
            url: '/' + pid + '/cards/merge',
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
        $card.find('.x-delete-handle').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (!confirm('Confirm?')) {
                return;
            }

            deleteCard(card._id)
                .then($card.fadeOut())
                .catch(err => console.error(err));
        });

        // Handle select card
        $card.find('.x-select-handle').on('click', toggleCardSelection)

        // Weight control
        var $weight = $card.find('.x-weight-control');
        $weight.find('[data-field=weight]').html(card.weight);
        [1, 2, 3, 5, 8, 13, 20, 40, 100].forEach(val => {
            $weight.find('.dropdown-menu').append($('<li><a href="#" data-value="'+val+'">'+val+'</a></li>'))
        });
        $weight.find('a').on('click', function(e) {
            var val = $(this).attr('data-value');
            $weight.find('[data-field=weight]').html(val);
            updateCard(card._id, { weight: val });
        });

        // Edit card
        $card.find('.x-content-handle').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            commitEditContext();
            $(this).hide();
            var lines = card.text.match(/[^\r\n]+/g);
            var $txt = $('<textarea class="form-control" rows="'+lines.length+'">');
            $(this).after($txt);
            $txt.focus().val(card.text).on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });
            editContext.card = card;
            editContext.$card = $card;
        });

        $card.on('click', commitEditContext);

        return $card;
    }

    function fill($target, field, value) {
        $target.find('[data-field=' + field + ']').html(value.replace(/\n/g, "<br />"));
    }

    var selectedCards = [];

    function toggleCardSelection(e) {
        e.preventDefault();
        e.stopPropagation();

        var $card = $(this).parents('.x-card');
        var cardId = $card.attr('data-card-id');

        if (selectedCards.indexOf(cardId) === -1) {
            selectedCards.push(cardId);
            $card.addClass('active');
            $card.find('.x-select-handle').addClass('btn-primary');
        } else {
            selectedCards.splice(selectedCards.indexOf(cardId), 1);
            $card.removeClass('active');
            $card.find('.x-select-handle').removeClass('btn-primary');
        }

        if (selectedCards.length > 1) {
            $('#mergeCardsBtn').fadeIn();
        } else {
            $('#mergeCardsBtn').fadeOut();
        }
    }

    function commitEditContext() {
        if (!editContext.card) {
            return;
        }
        editContext.card.text = editContext.$card.find('textarea').val();
        updateCard(editContext.card._id, { text: editContext.card.text });
        editContext.$card.find('textarea').hide().remove();
        editContext.$card.find('.x-content-handle').html(editContext.card.text.replace(/\n/g, "<br />")).show();
        editContext = {};
    }


})(jQuery);
