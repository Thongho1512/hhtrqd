"""
Infrastructure — ML Service
Handles model training, evaluation, persistence, and prediction.
Uses scikit-learn pipeline with preprocessing + RandomForestClassifier.
"""
import logging
import os
import pickle
import time
from datetime import datetime
from typing import Any, Dict, List

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import LabelEncoder, OneHotEncoder, StandardScaler

from app.application.interfaces.interfaces import IMLService
from app.domain.prediction_result import PredictionResult

logger = logging.getLogger(__name__)

# ─── Constants ────────────────────────────────────────────────────────────── #

# Columns that are constant / redundant — drop before training
DROP_COLS = ["EmployeeCount", "EmployeeNumber", "Over18", "StandardHours"]

# Target variable
TARGET_COL = "Attrition"

# Categorical feature names (after dropping irrelevant cols)
CATEGORICAL_FEATURES = [
    "BusinessTravel",
    "Department",
    "EducationField",
    "Gender",
    "JobRole",
    "MaritalStatus",
    "OverTime",
]

# Path where the trained pipeline is saved
_MODEL_DIR = os.path.join(os.path.dirname(__file__), "saved_models")
_MODEL_PATH = os.path.join(_MODEL_DIR, "hr_attrition_model.joblib")
_META_PATH = os.path.join(_MODEL_DIR, "model_meta.pkl")


class SklearnMLService(IMLService):
    """
    Concrete ML implementation using scikit-learn RandomForestClassifier
    wrapped inside a full preprocessing Pipeline.
    """

    def __init__(self):
        os.makedirs(_MODEL_DIR, exist_ok=True)
        self._pipeline: Pipeline | None = None
        self._feature_names: List[str] | None = None
        self._model_version: str = "untrained"
        self._confusion: Dict[str, Any] = {}

        # Try to load a pre-existing model on startup
        self._try_load_model()

    # ------------------------------------------------------------------ #
    #  Public interface
    # ------------------------------------------------------------------ #

    def train(self, df: pd.DataFrame) -> Dict[str, float]:
        """Full train → evaluate → save pipeline."""
        df = self._preprocess_raw(df)

        X = df.drop(columns=[TARGET_COL])
        y = df[TARGET_COL]  # already 0/1 after preprocess

        self._feature_names = list(X.columns)

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )

        # Build preprocessing → model pipeline
        numeric_features = [c for c in X.columns if c not in CATEGORICAL_FEATURES]

        preprocessor = ColumnTransformer(
            transformers=[
                ("num", StandardScaler(), numeric_features),
                ("cat", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL_FEATURES),
            ]
        )

        pipeline = Pipeline([
            ("preprocessor", preprocessor),
            ("classifier", RandomForestClassifier(
                n_estimators=200,
                max_depth=None,
                min_samples_split=2,
                class_weight="balanced",   # handle class imbalance
                random_state=42,
                n_jobs=-1,
            )),
        ])

        pipeline.fit(X_train, y_train)
        self._pipeline = pipeline

        # Evaluate
        y_pred = pipeline.predict(X_test)
        y_prob = pipeline.predict_proba(X_test)[:, 1]

        acc = float(accuracy_score(y_test, y_pred))
        auc = float(roc_auc_score(y_test, y_prob))
        f1 = float(f1_score(y_test, y_pred, zero_division=0))

        # Confusion matrix
        cm = confusion_matrix(y_test, y_pred)
        self._confusion = {
            "trueNegative": int(cm[0, 0]),
            "falsePositive": int(cm[0, 1]),
            "falseNegative": int(cm[1, 0]),
            "truePositive": int(cm[1, 1]),
        }

        # Versioning: timestamp-based
        version = datetime.now().strftime("%Y%m%d_%H%M%S")
        self._model_version = version

        # Persist
        joblib.dump(pipeline, _MODEL_PATH)
        with open(_META_PATH, "wb") as f:
            pickle.dump({
                "version": version,
                "feature_names": self._feature_names,
                "confusion": self._confusion,
            }, f)

        logger.info("Model saved to %s (version=%s)", _MODEL_PATH, version)
        return {"accuracy": acc, "auc": auc, "f1Score": f1, "modelVersion": version}

    def predict(self, features: Dict[str, Any]) -> PredictionResult:
        """
        Predict attrition for a single employee.
        Converts raw API features into the same shape the pipeline expects.
        """
        if self._pipeline is None:
            raise RuntimeError("Model not loaded. Train the model first.")

        # Build a single-row DataFrame matching the training feature names
        row = self._build_feature_row(features)
        prob = float(self._pipeline.predict_proba(row)[:, 1][0])
        will_attrite = prob >= 0.5

        return PredictionResult(will_attrite=will_attrite, probability=prob)

    def is_model_loaded(self) -> bool:
        return self._pipeline is not None

    def get_confusion_matrix(self) -> Dict[str, Any]:
        return self._confusion

    # ------------------------------------------------------------------ #
    #  Private helpers
    # ------------------------------------------------------------------ #

    def _preprocess_raw(self, df: pd.DataFrame) -> pd.DataFrame:
        """Drop constants, encode target to 0/1."""
        df = df.copy()
        df.drop(columns=[c for c in DROP_COLS if c in df.columns], inplace=True)

        # Encode label
        df[TARGET_COL] = (df[TARGET_COL] == "Yes").astype(int)
        return df

    def _build_feature_row(self, features: Dict[str, Any]) -> pd.DataFrame:
        """
        Turn a flat prediction-request dict into a DataFrame row that
        matches the set of columns the pipeline was trained on.
        """
        # Map PredictRequestDTO field names → CSV column names
        mapping = {
            "BusinessTravel": "BusinessTravel",
            "DailyRate": "DailyRate",
            "Department": "Department",
            "DistanceFromHome": "DistanceFromHome",
            "Education": "Education",
            "EducationField": "EducationField",
            "EnvironmentSatisfaction": "EnvironmentSatisfaction",
            "Gender": "Gender",
            "HourlyRate": "HourlyRate",
            "JobInvolvement": "JobInvolvement",
            "JobLevel": "JobLevel",
            "JobRole": "JobRole",
            "JobSatisfaction": "JobSatisfaction",
            "MaritalStatus": "MaritalStatus",
            "MonthlyIncome": "MonthlyIncome",
            "MonthlyRate": "MonthlyRate",
            "NumCompaniesWorked": "NumCompaniesWorked",
            "OverTime": "OverTime",
            "PercentSalaryHike": "PercentSalaryHike",
            "PerformanceRating": "PerformanceRating",
            "RelationshipSatisfaction": "RelationshipSatisfaction",
            "StockOptionLevel": "StockOptionLevel",
            "TotalWorkingYears": "TotalWorkingYears",
            "TrainingTimesLastYear": "TrainingTimesLastYear",
            "WorkLifeBalance": "WorkLifeBalance",
            "YearsAtCompany": "YearsAtCompany",
            "YearsInCurrentRole": "YearsInCurrentRole",
            "YearsSinceLastPromotion": "YearsSinceLastPromotion",
            "YearsWithCurrManager": "YearsWithCurrManager",
            "Age": "Age",
        }

        row_data: Dict[str, Any] = {}
        for api_key, col_name in mapping.items():
            if api_key in features:
                row_data[col_name] = features[api_key]

        row_df = pd.DataFrame([row_data])

        # Align to training feature names (fill any gap with 0)
        if self._feature_names:
            for col in self._feature_names:
                if col not in row_df.columns:
                    row_df[col] = 0
            row_df = row_df[self._feature_names]

        return row_df

    def _try_load_model(self):
        """Attempt to restore a previously saved pipeline from disk."""
        if os.path.exists(_MODEL_PATH) and os.path.exists(_META_PATH):
            try:
                self._pipeline = joblib.load(_MODEL_PATH)
                with open(_META_PATH, "rb") as f:
                    meta = pickle.load(f)
                self._feature_names = meta.get("feature_names")
                self._model_version = meta.get("version", "unknown")
                self._confusion = meta.get("confusion", {})
                logger.info("Restored saved model version: %s", self._model_version)
            except Exception as exc:
                logger.warning("Failed to load saved model: %s", exc)
                self._pipeline = None
