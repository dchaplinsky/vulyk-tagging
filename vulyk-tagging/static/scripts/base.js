$(function() {
    Handlebars.registerHelper('strictif', function(conditional, options) {
        return Handlebars.helpers['if'].call(this, conditional !== false, {fn: options.fn, inverse: options.inverse, hash: options.hash});
    });

    var data = {
        "sentence": [["Гучне", [[["adj", "post"], ["s", "nmbr"], ["n", "gndr"], ["v_naz", "CAse"], ["compb", "forms"]], [["adj", "post"], ["s", "nmbr"], ["n", "gndr"], ["v_zna", "CAse"], ["compb", "forms"]]]], ["затримання", [[["noun", "post"], ["s", "nmbr"], ["n", "gndr"], ["v_naz", "CAse"], ["inanim", "ANim"]], [["noun", "post"], ["s", "nmbr"], ["n", "gndr"], ["v_rod", "CAse"], ["inanim", "ANim"]], [["noun", "post"], ["s", "nmbr"], ["n", "gndr"], ["v_zna", "CAse"], ["inanim", "ANim"]], [["noun", "post"], ["p", "nmbr"], ["v_naz", "CAse"], ["inanim", "ANim"]], [["noun", "post"], ["p", "nmbr"], ["v_zna", "CAse"], ["inanim", "ANim"]]]], ["підполковника", [[["noun", "post"], ["s", "nmbr"], ["m", "gndr"], ["v_rod", "CAse"], ["anim", "ANim"]], [["noun", "post"], ["s", "nmbr"], ["m", "gndr"], ["v_zna", "CAse"], ["anim", "ANim"]]]], ["Нацгвардії", []], ["за", [[["prep", "post"], ["rv_rod", "req_case"], ["rv_zna", "req_case"], ["rv_oru", "req_case"]]]], ["хабар", [[["noun", "post"], ["s", "nmbr"], ["m", "gndr"], ["v_naz", "CAse"], ["inanim", "ANim"]], [["noun", "post"], ["s", "nmbr"], ["m", "gndr"], ["v_zna", "CAse"], ["inanim", "ANim"]]]], ["від", [[["prep", "post"], ["rv_rod", "req_case"]]]], ["постачальника", [[["noun", "post"], ["s", "nmbr"], ["m", "gndr"], ["v_rod", "CAse"], ["anim", "ANim"]], [["noun", "post"], ["s", "nmbr"], ["m", "gndr"], ["v_zna", "CAse"], ["anim", "ANim"]]]], ["консервів", [[["noun", "post"], ["p", "nmbr"], ["v_rod", "CAse"], ["inanim", "ANim"]]]], ["може", [[["verb", "post"], ["unknown", "aux"]], [["insert", "post"]]]], ["обернутись", [[["verb", "post"], ["inf", "verb_type"], ["rev", "aux"], ["perf", "aspc"]]]], ["пшиком", [[["noun", "post"], ["s", "nmbr"], ["m", "gndr"], ["v_oru", "CAse"], ["inanim", "ANim"]]]], [",", false], ["оскільки", [[["conj", "post"], ["subord", "conj_type"]]]], ["військових", [[["adj", "post"], ["p", "nmbr"], ["v_mis", "CAse"]], [["adj", "post"], ["p", "nmbr"], ["v_rod", "CAse"]], [["adj", "post"], ["p", "nmbr"], ["v_zna", "CAse"]]]], ["тиловиків", [[["noun", "post"], ["p", "nmbr"], ["v_rod", "CAse"], ["anim", "ANim"]], [["noun", "post"], ["p", "nmbr"], ["v_zna", "CAse"], ["anim", "ANim"]]]], ["не", [[["part", "post"]]]], ["люблять", [[["verb", "post"], ["pres", "tense"], ["p", "nmbr"], ["3", "PErs"], ["imperf", "aspc"]]]], ["садити", [[["verb", "post"], ["inf", "verb_type"], ["imperf", "aspc"]]]], ["в", [[["prep", "post"], ["rv_zna", "req_case"], ["rv_mis", "req_case"], ["rv_rod", "req_case"], ["v-u", "aux"]]]], ["тюрму", [[["noun", "post"], ["s", "nmbr"], ["f", "gndr"], ["v_zna", "CAse"], ["inanim", "ANim"]]]], [".", false]]},

        template = Handlebars.compile($('#tagme_template').html()),
        output = $("#out"),
        bar = $(".total-progress"),
        words_wrapper;

    output.html(template(data));
    words_wrapper = output.find("> .word-wrapper");


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
        select(words_wrapper.find("a.word.active").parent().next(),
               true);
    }

    function select_prev() {
        select(words_wrapper.find("a.word.active").parent().prev(),
               true);
    }

    function update_progress() {
        if (words_wrapper.length == 0) {
            // degenerate case
            word_wrapper.hide();
        } else {
            bar
                .find(".progress-bar")
                .width((words_wrapper.filter(".done").length / words_wrapper.length * 100) + "%");
        }
    }

    output.find("a.tags").on("click", function(e) {
        e.preventDefault();
        var el = $(this),
            word_wrapper = el.closest(".word-wrapper");

        word_wrapper.addClass("done").data("tags", el.data("tags"));
        update_progress();

        // Good ol' tricks
        window.setTimeout(select_next, 0);
    });

    words_wrapper.find("a.word").on("click", function(e) {
        e.preventDefault();
        select($(this).parent(), false);
    });

    key('left', select_prev);
    key('right', select_next);

    select(words_wrapper.eq(0), true);
    update_progress();
});
