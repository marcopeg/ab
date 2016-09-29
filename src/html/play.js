
(function($) {

    var pid = $('body').attr('data-pid');
    var cardTemplate = $('#card-template').html();
    var roundTemplate = $('#round-template').html();
    var resultsTemplate = $('#results-template').html();

    var state = {
        cards: [],
        rounds: [],
        isPlaying: false,
        score: {
            min: 0,
            max: 0,
        },
    };

    var $scene = $('#scene');

    Promise.resolve()
        .then(() => render())
        .then(() => loadCards())
        .then(cards => cards.filter(card => card.text !== undefined))
        .then(cards => state.cards = cards)
        .then(() => computeScoreRange())
        .then(() => state.isPlaying = true)
        .then(() => render())
        .catch(err => console.error(err));


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

    function render() {
        $scene.empty();

        if (state.cards.length && state.isPlaying) {
            return renderRound();
        }

        if (state.rounds.length) {
            return renderResults();
        }
    }

    function renderResults() {
        var score = state.rounds.reduce((a, card) => {
            var weight = card.weight || 1;
            if (card.type === 'pros') {
                return a + weight;
            } else {
                return a - weight;
            }
        }, 0);

        var min = 0;
        var max = state.score.max + Math.abs(state.score.min);
        score += Math.abs(state.score.min);
        if (score < 0) {
            score = 1;
        }
        var perc = score * 100 % max;

        var results = resultsTemplate.replace(/\{perc\}/g, perc)

        var $results = $(results);
        fill($results, 'min', min);
        fill($results, 'max', max);
        fill($results, 'score', score);
        fill($results, 'perc', perc);
        $results.appendTo($scene);
    }

    function renderRound() {
        var cards = randomizeCards(state.cards);
        var $round = buildRound(cards[0], cards[1]);
        $round.appendTo($scene);
    }

    function randomizeCards(cards) {
        var randomized = window.knuthShuffle(cards.slice(0));
        return [randomized[0], randomized[1]];
    }

    function buildRound(card1, card2) {
        var $round = $(roundTemplate);
        $round.find('[data-field=card1]').append(buildCard(card1));
        $round.find('[data-field=card2]').append(buildCard(card2));

        $round.find('#play-results').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            state.isPlaying = false;
            render();
        });

        return $round;
    }

    function buildCard(card) {
        var $card = $(cardTemplate);
        fill($card, 'content', card.text);

        $card.on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            state.rounds.push(card);
            render();
        });

        return $card;
    }

    function fill($target, field, value) {
        value = value || '';
        $target.find('[data-field=' + field + ']').html(value.toString().replace(/\n/g, "<br />"));
    }

    function computeScoreRange() {
        state.score.max = state.cards
            .filter(_ => _.type === 'pros')
            .reduce((a, b) => a + (b.weight || 1), 0);
        state.score.min = state.cards
            .filter(_ => _.type !== 'pros')
            .reduce((a, b) => a - (b.weight || 1), 0);
    }

})(jQuery);
