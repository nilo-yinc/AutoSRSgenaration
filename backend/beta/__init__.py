"""
AutoSRS Package

AI-powered Software Requirements Specification document generator.
Built with FastAPI, Google ADK, and LiteLLM.
"""

__version__ = "1.1.0"
__author__ = "Your Name"
__license__ = "Proprietary"
__description__ = "AI-powered SRS document generator"

from .main import app

__all__ = ["app"]
