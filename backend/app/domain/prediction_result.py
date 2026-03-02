"""
Domain entity: PredictionResult
Represents the output of an attrition prediction.
"""
from dataclasses import dataclass


@dataclass
class PredictionResult:
    """
    Domain entity encapsulating a binary attrition prediction.
    
    Attributes:
        will_attrite:  True if model predicts the employee will leave.
        probability:   Probability score in [0, 1] for attrition = Yes.
    """
    will_attrite: bool
    probability: float
