# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from vulyk.models.task_types import AbstractTaskType

from vulyk_tagging.models.tasks import TaggingAnswer, TaggingTask


class TaggingTaskType(AbstractTaskType):
    """
    Tagging Task to work with Vulyk.
    """
    answer_model = TaggingAnswer
    task_model = TaggingTask

    name = 'Тэггинг текста'
    description = 'Проверка текста на правильное распознание'

    template = 'base.html'
    helptext_template = 'help.html'
    type_name = 'tagging_task'

    redundancy = 3

    JS_ASSETS = ['static/scripts/keymaster.js',
                 'static/scripts/handlebars.js',
                 'static/scripts/bootstrap-select.js',
                 'static/scripts/typeahead.js',
                 'static/scripts/bootstrap-tagsinput.js',
                 'static/scripts/base.js']

    CSS_ASSETS = ['static/styles/bootstrap-select.css',
                  'static/styles/bootstrap-tagsinput.css',
                  'static/styles/base.css',
                  'static/styles/autocomplete.css']
