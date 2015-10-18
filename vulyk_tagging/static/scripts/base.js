$(function() {
    var template = Handlebars.compile($('#tagme_template').html()),
        popup_template = Handlebars.compile($('#tagpopup_template').html()),
        tagset_template = Handlebars.compile($('#tagset_template').html()),
        output = $("#out"),
        bar = $(".total-progress"),
        word_wrapper,
        tags_dict,
        tags;

    Handlebars.registerHelper('strictif', function(conditional, options) {
        return Handlebars.helpers['if'].call(this, conditional !== false, {fn: options.fn, inverse: options.inverse, hash: options.hash});
    });

    tags_dict = {
        post: [
            'noun', 'pron', 'verb', 'adj', 'adjp', 'adv', 'advp',
            'prep', 'predic', 'insert', 'conj', 'part', 'excl', 'numr'
        ],
        nmbr: ['p', 's'],
        gndr: ['m', 'f', 'n'],
        PErs: ["1", "2", "3"],
        CAse: ['v_naz', 'v_rod', 'v_dav', 'v_zna', 'v_oru', 'v_mis', 'v_kly'],
        tantum: ['np', 'ns'],
        req_case: ['rv_naz', 'rv_rod', 'rv_dav', 'rv_zna', 'rv_oru', 'rv_mis'],
        tense: ['futr', 'past', 'pres'],
        mood: ['impr'],
        verb_type: ['inf', 'impers'],
        voice: ['actv', 'pasv'],
        conj_type: ['subord', 'coord'],
        aspc: ['perf', 'imperf'],
        trns: ['tran', 'intran'],
        forms: ['compb', 'compr', 'super'],
        ANim: ['anim', 'inanim'],
        aux: ["nv", "bad", "rev", "rare", "v-u", "abbr", "coll", "slang",
              "unknown", "pers", "alt", "init", "fname", "lname", "patr",
              "number", "dem", "int", "rel", "pos", "def", "ind", "refl",
              "neg", "gen", "contr", "time", "&pron", "&adj", "phras"]
    };

    tags = $.map(tags_dict, function(tags, type) {
        return $.map(tags, function(tag) {
            return {text: tag, type: type};
        });
    });

    function select(item, toggle) {
        var tags;

        if (item.length) {
            words_wrapper.find(".active").removeClass("active");

            item.find("a.word").addClass("active");

            if (toggle) {
                window.setTimeout(function() {
                    item.find("a.word").dropdown("toggle");
                }, 0);
            }

            tags = item.data("tags");
            if (tags) {
                item.find("a.tags").removeClass("done");
                item.find("a.tags[data-tags='" + tags + "']")
                    .focus()
                    .addClass("done");
            } else if (toggle) {
                window.setTimeout(function() {
                    item.find("a.tags").eq(0).focus();
                });
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
        return output.find(">div.done").map(function() {
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

        output.find("[data-tags=NONE]").magnificPopup({
            // closeOnBgClick: false;
            items: {
                type: "inline",
                src: popup_template()
            },
            callbacks: {
                close: function() {
                    select(this.st.el.closest(".word-wrapper"), true);
                },
                open: function() {
                    var popup = this,
                        itemJustAdded = false,
                        button = $(".mfp-content .btn-save"),
                        lemma_input = $(".mfp-content .lemma-autocomplete"),
                        input = $(".mfp-content .tags-autocomplete"),
                        closeAndUpdate = function() {
                            if (input.val()) {
                                var tags = input.val().split(","),
                                    html = tagset_template({
                                        tags_serialized: tags.join(":") + ":", 
                                        tags: input.tagsinput("items"),
                                        lemma: $.trim(lemma_input.val())
                                    }),
                                    li = popup.st.el.parent();

                                if (tags !== "") {
                                    popup.close();
        
                                    li.before(html);
                                    li.prev().find("a").click();
                                }
                            }
                        },
                        keyboardHandler = function(e) {
                            // confirm first suggestion on tab
                            if (e.which === 9 || e.which === 13) {
                                var self = $(this),
                                    typed = $(e.target).val(),
                                    menu = self.data("ttTypeahead").menu,
                                    suggestions = menu.getSelectableData(menu.getTopSelectable());

                                if (suggestions) {
                                    input.tagsinput("add", suggestions.obj);
                                    self.typeahead("val", "");
                                } else if (e.which === 13 && !itemJustAdded) {
                                    closeAndUpdate();
                                }

                                itemJustAdded = false;
                                e.stopPropagation();
                            }
                        },
                        ti = input.tagsinput({
                            itemValue: "text",
                            itemText: "text",
                            freeInput: false,
                            confirmKeys: [],
                            tagClass: function(item) {
                                return "label label-default label-" + item.type;
                            },
                            typeaheadjs: [
                                {
                                    hint: false
                                },
                                {
                                    displayKey: "text",
                                    source: function(query, sync) {
                                        var suggestions = [];

                                        $.each(tags, function(i, tag) {
                                            if ((new RegExp('^' + query)).test(tag.text)) {
                                                suggestions.push(tag);
                                            }
                                        });

                                        sync(suggestions);
                                    }
                                }
                            ]
                        });

                    ti[0].$input.on("keydown", keyboardHandler);

                    // input.on("beforeItemAdd", function(e) {
                    //     // check if we don't have tags of the same type yet
                    //     var items = $(e.target).tagsinput("items");

                    //     $.each(items, function(_, tag) {
                    //         if (e.item.type === tag.type) {
                    //             e.cancel = true;
                    //         }
                    //     });
                    // });

                    input.on("itemAdded", function(e) {
                        itemJustAdded = true;
                    });

                    button.on("click", closeAndUpdate);

                    window.setTimeout(function() {
                        lemma_input.focus();
                    }, 0);
                }
            }
        });

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
