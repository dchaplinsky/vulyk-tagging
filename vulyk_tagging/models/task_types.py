# -*- coding: utf-8 -*-

from vulyk.models.task_types import AbstractTaskType

from .tasks import TaggingTask, TaggingAnswer


class TaggingTaskType(AbstractTaskType):
    """
    Tagging Task to work with Vulyk.
    """
    answer_model = TaggingTask
    task_model = TaggingAnswer

    template = "vulyk_tagging/index.html"
    type_name = "tagging_task"

    redundancy = 3
