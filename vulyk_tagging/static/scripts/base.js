$(function() {
    var template = Handlebars.compile($('#tagme_template').html()),
        output = $("#out"),
        bar = $(".total-progress"),
        word_wrapper;

    Handlebars.registerHelper('strictif', function(conditional, options) {
        return Handlebars.helpers['if'].call(this, conditional !== false, {fn: options.fn, inverse: options.inverse, hash: options.hash});
    });

    function select(item, toggle) {
        var tags;

        if (item.length) {
            words_wrapper.find(".active").removeClass("active");

            item.find("a.word").addClass("active");

            if (toggle) {
                item.find("a.word").dropdown("toggle");
            }

            tags = item.data("tags");
            if (tags) {
                item.find("a.tags[data-tags='" + tags + "']")
                    .focus()
                    .addClass("done");
            } else {
                item.find("a.tags").eq(0).focus();
            }
        }
    }

    function select_next() {
        select(
            words_wrapper.find("a.word.active").parent().nextAll(".word-wrapper:first"),
            true);
    }

    function select_prev() {
        select(
            words_wrapper.find("a.word.active").parent().prevAll(".word-wrapper:first"),
            true);
    }

    function update_progress() {
        if (words_wrapper.length == 0) {
            // degenerate case
            word_wrapper.hide();
        } else {
            bar
                .find(".progress-bar")
                .width(
                    (words_wrapper.filter(".done").length /
                     words_wrapper.length * 100) + "%");
        }
    }

    function serialize() {
        return output.find(">div.done").map(function(){
            var word = $(this);
            return {word: word.find("a").html(), tags: word.data("tags")};
        }).get();
    }

    output.on("click", "a.tags", function(e) {
        e.preventDefault();
        var el = $(this),
            word_wrapper = el.closest(".word-wrapper");

        word_wrapper.addClass("done").data("tags", el.data("tags"));
        update_progress();

        // Good ol' tricks
        window.setTimeout(select_next, 0);
    });

    output.on("click", ".no-word-wrapper a", function(e) {
        e.preventDefault();
    });


    key('left', select_prev);
    key('right', select_next);

    $(document.body).on("vulyk.next", function(e, data) {
        output.html(template(data.result.task.data));
        words_wrapper = output.find("> .word-wrapper");

        words_wrapper.find("a.word").on("click", function(e) {
            e.preventDefault();
            select($(this).parent(), false);
        });

        select(words_wrapper.eq(0), true);
        update_progress();
    }).on("vulyk.save", function(e, callback) {
        if (words_wrapper.filter(".done").length == words_wrapper.length) {
            callback(serialize());
        } else {
            select(words_wrapper.filter(":not(.done)").eq(0), true);          
        }
    }).on("vulyk.skip", function(e, callback) {
        callback();
    });
});
