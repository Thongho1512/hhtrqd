"""
ML Service — Application layer.
Orchestrates training and prediction by delegating to the IMLService implementation.
"""
import logging
import time
from typing import Dict, Any

from app.application.interfaces.interfaces import ICSVLoader, IMLService
from app.application.dtos import (
    TrainResponseDTO, PredictRequestDTO, PredictResponseDTO, DashboardSummaryDTO,
    DepartmentStatDTO, JobRoleStatDTO,
)

logger = logging.getLogger(__name__)


class MLAppService:
    """
    Application service that orchestrates ML workflows.
    Follows Dependency Injection — receives implementations via constructor.
    """

    def __init__(self, csv_loader: ICSVLoader, ml_service: IMLService):
        self._loader = csv_loader
        self._ml = ml_service

    # ----------------------------------------------------------------------- #
    #  Train
    # ----------------------------------------------------------------------- #

    def train_model(self) -> TrainResponseDTO:
        """Load CSV → train → evaluate → return metrics."""
        logger.info("Starting model training pipeline …")
        t0 = time.perf_counter()

        df = self._loader.load()
        logger.info("Dataset loaded: %d rows, %d cols", len(df), len(df.columns))

        metrics = self._ml.train(df)
        elapsed = round(time.perf_counter() - t0, 3)

        logger.info(
            "Training complete in %.2fs — acc=%.4f auc=%.4f f1=%.4f",
            elapsed, metrics["accuracy"], metrics["auc"], metrics["f1Score"],
        )

        return TrainResponseDTO(
            accuracy=round(metrics["accuracy"], 4),
            auc=round(metrics["auc"], 4),
            f1Score=round(metrics["f1Score"], 4),
            modelVersion=metrics.get("modelVersion", "1.0"),
            trainingTime=elapsed,
            confusionMatrix=self._ml.get_confusion_matrix(),
        )

    # ----------------------------------------------------------------------- #
    #  Predict
    # ----------------------------------------------------------------------- #

    def predict_attrition(self, request: PredictRequestDTO) -> PredictResponseDTO:
        """Transform DTO → domain prediction → response DTO."""
        if not self._ml.is_model_loaded():
            raise RuntimeError(
                "No trained model found. Please call /api/ml/train first."
            )

        features: Dict[str, Any] = request.model_dump()
        result = self._ml.predict(features)

        # Map probability to risk level
        if result.probability < 0.35:
            risk = "LOW"
        elif result.probability < 0.65:
            risk = "MEDIUM"
        else:
            risk = "HIGH"

        return PredictResponseDTO(
            willAttrite=result.will_attrite,
            probability=round(result.probability, 4),
            riskLevel=risk,
        )

    # ----------------------------------------------------------------------- #
    #  Dashboard
    # ----------------------------------------------------------------------- #

    def get_dashboard_summary(self) -> DashboardSummaryDTO:
        """Compute key statistics directly from the CSV dataset."""
        df = self._loader.load()

        total = len(df)
        attrited = int((df["Attrition"] == "Yes").sum())
        attrition_rate = round(attrited / total * 100, 2)

        avg_age = round(df["Age"].mean(), 1)
        avg_income = round(df["MonthlyIncome"].mean(), 0)
        avg_years = round(df["YearsAtCompany"].mean(), 1)

        # Department breakdown
        dept_stats = []
        for dept, grp in df.groupby("Department"):
            g_total = len(grp)
            g_attr = int((grp["Attrition"] == "Yes").sum())
            dept_stats.append(DepartmentStatDTO(
                department=dept,
                total=g_total,
                attrited=g_attr,
                attritionRate=round(g_attr / g_total * 100, 2),
            ))

        # Job role breakdown (top 9)
        role_stats = []
        for role, grp in df.groupby("JobRole"):
            g_total = len(grp)
            g_attr = int((grp["Attrition"] == "Yes").sum())
            role_stats.append(JobRoleStatDTO(
                jobRole=role,
                total=g_total,
                attrited=g_attr,
                attritionRate=round(g_attr / g_total * 100, 2),
            ))
        role_stats.sort(key=lambda x: x.attritionRate, reverse=True)

        # Overtime attrition
        ot_yes = df[df["OverTime"] == "Yes"]
        ot_no = df[df["OverTime"] == "No"]
        ot_attr_rate = round((ot_yes["Attrition"] == "Yes").sum() / len(ot_yes) * 100, 2)
        non_ot_attr_rate = round((ot_no["Attrition"] == "Yes").sum() / len(ot_no) * 100, 2)

        # Age distribution buckets
        bins = [18, 25, 30, 35, 40, 45, 50, 55, 61]
        labels = ["18-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55+"]
        df["AgeBin"] = pd.cut(df["Age"], bins=bins, labels=labels, right=False)
        age_dist = df["AgeBin"].value_counts().to_dict()
        age_dist = {str(k): int(v) for k, v in sorted(age_dist.items(), key=lambda x: x[0])}

        # Income distribution buckets
        income_labels = ["<2K", "2K-5K", "5K-8K", "8K-12K", "12K-20K", "20K+"]
        income_bins = [0, 2000, 5000, 8000, 12000, 20000, 999999]
        df["IncomeBin"] = pd.cut(df["MonthlyIncome"], bins=income_bins, labels=income_labels, right=False)
        income_dist = df["IncomeBin"].value_counts().to_dict()
        income_dist = {str(k): int(v) for k, v in income_dist.items()}

        return DashboardSummaryDTO(
            totalEmployees=total,
            attritionCount=attrited,
            attritionRate=attrition_rate,
            avgAge=avg_age,
            avgMonthlyIncome=avg_income,
            avgYearsAtCompany=avg_years,
            departmentStats=dept_stats,
            jobRoleStats=role_stats,
            overtimeAttritionRate=ot_attr_rate,
            nonOvertimeAttritionRate=non_ot_attr_rate,
            ageDistribution=age_dist,
            incomeDistribution=income_dist,
        )


# Local import to avoid circular dependency at module level
import pandas as pd
