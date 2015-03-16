# -*- coding: utf-8 -*-

__author__ = 'Volodymyr Hotsyk'
__email__ = 'gotsyk@gmail.com'
__version__ = '0.1.0'


# -*- coding=utf-8 -*-
import logging

from werkzeug.utils import import_string


logger = logging.getLogger(__name__)


def configure(self_settings):
    """
    Getting plugin's default settings, overwriting them with settings
    from local_settings.py, returns dict of settings
    """
    settings = {}
    try:
        local_settings = import_string('vulyk.local_settings')
        for attr in dir(self_settings):
            settings[attr] = getattr(self_settings, attr)
        for attr in dir(local_settings):
            if attr in dir(self_settings):
                settings[attr] = getattr(local_settings, attr)
    except Exception as e:
        logger.warning(e)

    return settings
