"""
Abstract interfaces for ML and data-loading contracts.
All infrastructure implementations must satisfy these contracts.
"""
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Tuple
import pandas as pd

from app.domain.prediction_result import PredictionResult


class ICSVLoader(ABC):
    """Contract for loading employee data from a CSV source."""

    @abstractmethod
    def load(self) -> pd.DataFrame:
        """Read the employee dataset and return a pandas DataFrame."""
        pass

    @abstractmethod
    def get_employee_by_id(self, employee_id: int) -> Any:
        """Retrieve a single employee by ID."""
        pass


class IMLService(ABC):
    """Contract for training and prediction operations."""

    @abstractmethod
    def train(self, df: pd.DataFrame) -> Dict[str, float]:
        """
        Train a model on the provided DataFrame.

        Returns:
            Dict with keys: accuracy, auc, f1Score
        """
        ...

    @abstractmethod
    def predict(self, features: Dict[str, Any]) -> PredictionResult:
        """
        Run inference for a single employee record.

        Args:
            features: Dict of feature name -> value (raw, un-encoded).

        Returns:
            PredictionResult with will_attrite and probability.
        """
        ...

    @abstractmethod
    def is_model_loaded(self) -> bool:
        """Return True if a trained model is available."""
        ...

    @abstractmethod
    def get_confusion_matrix(self) -> Dict[str, Any]:
        """Return last confusion matrix data."""
        ...
