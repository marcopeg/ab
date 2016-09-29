
/**
 * Populate cards for a project
 */

(function($) {
    var $form = $('#project-brainstorm');
    var $textarea = $form.find('textarea');

    $form.on('submit', e => {
        e.preventDefault();
        e.stopPropagation();
    });

    $form.find('button[type=submit]').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var $submitBtn = $(this);

        var data = {
            text: $textarea.val(),
            type: $submitBtn.val(),
        };

        if (!data.text) {
            return;
        }

        var ajaxConf = {
            method: $form.attr('method'),
            url: $form.attr('action'),
            contentType: 'application/json',
            data: JSON.stringify(data),
            dataType: 'json',
        };

        $.ajax(ajaxConf)
            .done(() => $textarea.val('').focus())
            .fail((xhr, msg, err) => console.error(msg, err));
    });

    new QRCode(document.getElementById('qrcode'), window.location.href);
    $('#qrcode-box a').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).hide();
        $('#qrcode-box .wrapper').fadeIn();
    })
    
})(jQuery)
