# -*- coding: utf-8 -*-

from mongoengine import DictField, StringField

from vulyk.models.tasks import AbstractTask, AbstractAnswer


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
