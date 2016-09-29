
/**
 * Populate cards for a project
 */

(function($) {
    var $form = $('#project-settings');
    var $textarea = $form.find('textarea');

    $form.on('submit', e => {
        e.preventDefault();
        e.stopPropagation();

        var $submitBtn = $form.find('button[type=submit]:focus');

        var data = {
            question: $form.find('input[name=question]').val(),
        };

        var ajaxConf = {
            method: $form.attr('method'),
            url: $form.attr('action'),
            contentType: 'application/json',
            data: JSON.stringify(data),
            dataType: 'json',
        };

        $.ajax(ajaxConf)
            .done(() => $submitBtn.blur())
            .fail((xhr, msg, err) => console.error(msg, err));
    });
})(jQuery)
