# -*- coding: utf-8 -*-

from mongoengine import DictField, StringField

from vulyk.models.tasks import AbstractTask, AbstractAnswer
from vulyk.models.task_types import AbstractTaskType


class TaggingTask(AbstractTask):
    """
    Tagging Task to work with Vulyk.
    """
    pass


class TaggingAnswer(AbstractAnswer):
    """
    Tagging Answer to work with Vulyk
    """
    pass


class TaggingTaskType(AbstractTaskType):
    """
    Tagging Task to work with Vulyk.
    """
    answer_model = TaggingAnswer
    task_model = TaggingTask

    template = "base.html"
    helptext_template = "help.html"
    type_name = "tagging_task"

    redundancy = 3

    JS_ASSETS = ["static/scripts/keymaster.js",
                 "static/scripts/handlebars.js",
                 "static/scripts/bootstrap-select.js",
                 "static/scripts/base.js"]

    CSS_ASSETS = ["static/styles/bootstrap-select.css",
                  "static/styles/base.css"]
