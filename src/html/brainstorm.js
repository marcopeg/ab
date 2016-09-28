
// trigger form submit from buttons outside the form
$(document).delegate('button[type=submit]', 'click', function(e) {
    var $textarea = $('form').find('textarea');
    var $submitBtn = $(this);

    let data = {
        text: $textarea.val(),
        type: $submitBtn.val(),
    };

    sendCard(data)
    .then(() => $textarea.val('').focus())
    .catch(err => console.error(err));

    $submitBtn.blur();
});

function sendCard(data) {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: 'post',
            url: '/cards',
            contentType: 'application/json',
            data: JSON.stringify(data),
            dataType: 'json',
            success: resolve,
            error: reject,
        });
    });
}
