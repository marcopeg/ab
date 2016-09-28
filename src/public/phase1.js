
jQuery(document).delegate('form', 'submit', function(e) {
    e.preventDefault();
    e.stopPropagation();

    var $form = $(this);
    var $textarea = $form.find('textarea');
    var $submitBtn = $form.find('button[type=submit]:focus');
    $submitBtn.blur();

    let data = {
        text: $textarea.val(),
        type: $submitBtn.val(),
    };

    $.ajax({
        method: 'post',
        url: '?',
        contentType: 'application/json',
        data: JSON.stringify(data),
        dataType: 'json',
        success: onSuccess,
        error: onError,
        complete: onComplete,
    });

    function onSuccess(res) {
        $textarea.val('').focus();
    }

    function onError(err) {
        alert("It wasn't possible to save this note!");
    }

    function onComplete() {}

});
