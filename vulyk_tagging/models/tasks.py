# -*- coding: utf-8 -*-

from mongoengine import DictField, StringField

from vulyk.models.tasks import AbstractTask, AbstractAnswer
from vulyk.models.task_types import AbstractTaskType


class TaggingTask(AbstractTask):
    """
    Tagging Task to work with Vulyk.
    """
    sentence = StringField()

    meta = {
        'collection': 'tagging_tasks',
        'allow_inheritance': True,
        'indexes': [
            'task_type'
        ]
    }


class TaggingAnswer(AbstractAnswer):
    """
    Tagging Answer to work with Vulyk
    """
    sentance = DictField()

    meta = {
        'collection': 'tagging_reports',
        'allow_inheritance': True,
        'indexes': [
            'task',
            'created_by',
            'created_at'
        ]
    }


class TaggingTaskType(AbstractTaskType):
    """
    Tagging Task to work with Vulyk.
    """
    answer_model = TaggingAnswer
    task_model = TaggingTask

    template = "vulyk_tagging/index.html"
    type_name = "tagging_task"

    redundancy = 3
