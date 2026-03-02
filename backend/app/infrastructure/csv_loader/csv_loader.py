"""
Infrastructure — CSV Loader
Reads the IBM HR Attrition dataset directly from a CSV file.
No database involved.
"""
import logging
import os

import pandas as pd

from app.application.interfaces.interfaces import ICSVLoader

logger = logging.getLogger(__name__)

# Absolute path to the dataset relative to this file's location
_DEFAULT_CSV_PATH = os.path.join(
    os.path.dirname(__file__),
    "..", "..", "..", "..",  # go up to source/
    "WA_Fn-UseC_-HR-Employee-Attrition.csv",
)


class CSVLoader(ICSVLoader):
    """
    Concrete CSV loader implementation.
    Reads the dataset from disk and returns a clean DataFrame.
    """

    def __init__(self, csv_path: str | None = None):
        self._csv_path = os.path.abspath(csv_path or _DEFAULT_CSV_PATH)
        logger.info("CSVLoader initialised. Dataset path: %s", self._csv_path)

    def load(self) -> pd.DataFrame:
        """Load and lightly validate the CSV file."""
        if not os.path.exists(self._csv_path):
            raise FileNotFoundError(
                f"HR dataset not found at: {self._csv_path}\n"
                "Place 'WA_Fn-UseC_-HR-Employee-Attrition.csv' in the source folder."
            )

        df = pd.read_csv(self._csv_path)
        logger.info("Loaded %d employee records from CSV.", len(df))

        # Sanity checks
        required_cols = {"Age", "Attrition", "MonthlyIncome", "JobRole"}
        missing = required_cols - set(df.columns)
        if missing:
            raise ValueError(f"CSV is missing expected columns: {missing}")

        return df
