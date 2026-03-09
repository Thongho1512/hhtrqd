"""
ML Service — Application layer.
Orchestrates training and prediction by delegating to the IMLService implementation.
"""
import logging
import time
from typing import Dict, Any, List

from app.application.interfaces.interfaces import ICSVLoader, IMLService
from app.application.dtos import (
    TrainResponseDTO, PredictRequestDTO, PredictResponseDTO, DashboardSummaryDTO,
    DepartmentStatDTO, JobRoleStatDTO, DepartmentPredictResponseDTO, EmployeeRiskDTO,
    EmployeeDetailDTO, RiskFactorDTO, PredictionSummaryDTO
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

    def _classify_employee_group(self, risk_score: float, performance_tier: str) -> Dict[str, Any]:
        """
        [BƯỚC 2] Strategic classification logic based on risk and performance.
        """
        is_high_risk = risk_score >= 0.65

        if is_high_risk and performance_tier in ["excellent", "good"]:
            return {
                "group_code": "PA_GIU_CHAN",
                "group_name": "🔴 GIỮ CHÂN KHẨN CẤP",
                "color": "#EF4444",
                "description": "Nguy cơ cao + Giỏi — Ưu tiên can thiệp ngay"
            }
        elif is_high_risk and performance_tier == "poor":
            return {
                "group_code": "PA_THAY_THE",
                "group_name": "🟠 THAY THẾ",
                "color": "#F97316",
                "description": "Nguy cơ cao + Kém — Chấp nhận nghỉ, kích hoạt tuyển dụng"
            }
        elif not is_high_risk and performance_tier in ["excellent", "good"]:
            return {
                "group_code": "PA_NUOI_DUONG",
                "group_name": "🟢 NUÔI DƯỠNG",
                "color": "#22C55E",
                "description": "Nguy cơ thấp + Giỏi — Đưa vào talent pool, giữ động lực"
            }
        elif not is_high_risk and performance_tier == "average":
            return {
                "group_code": "PA_ON_DINH",
                "group_name": "🔵 ỔN ĐỊNH",
                "color": "#3B82F6",
                "description": "Nguy cơ thấp + Trung bình — Duy trì, không can thiệp sâu"
            }
        else: # low risk + poor OR mid/other
            return {
                "group_code": "PA_PHONG_NGUA",
                "group_name": "🟡 PHÒNG NGỪA",
                "color": "#EAB308",
                "description": "Nguy cơ trung bình — Đối thoại, cải thiện môi trường"
            }

    def predict_department(self, department_name: str) -> DepartmentPredictResponseDTO:
        """[BƯỚC 1] Fetch all employees in a department, predict risk, and group strategically."""
        if not self._ml.is_model_loaded():
            raise RuntimeError("No trained model found. Please train first.")

        df = self._loader.load()
        dept_df = df[df["Department"] == department_name].copy()

        if dept_df.empty:
            return DepartmentPredictResponseDTO(
                department={"id": department_name, "name": department_name, "total_employees": 0},
                employeeRisks=[],
                summary=PredictionSummaryDTO(highRiskCount=0, mediumRiskCount=0, lowRiskCount=0, featureImportance={})
            )

        risks = []
        high_cnt, mid_cnt, low_cnt = 0, 0, 0

        for _, row in dept_df.iterrows():
            features = row.to_dict()
            result = self._ml.predict(features)
            prob = result.probability

            if prob < 0.40:
                risk_lvl = "LOW"
                low_cnt += 1
            elif prob < 0.70:
                risk_lvl = "MEDIUM"
                mid_cnt += 1
            else:
                risk_lvl = "HIGH"
                high_cnt += 1

            rating = int(row.get("PerformanceRating", 3))
            perf_tier = "average"
            if rating == 4: perf_tier = "excellent"
            elif rating == 3: perf_tier = "good"
            elif rating == 1: perf_tier = "poor"
            
            group_info = self._classify_employee_group(prob, perf_tier)

            factors = []
            if row.get("OverTime") == "Yes":
                factors.append(RiskFactorDTO(factor="OverTime", contribution=0.22, direction="negative"))
            if row.get("MonthlyIncome") < 4000:
                factors.append(RiskFactorDTO(factor="MonthlyIncome", contribution=0.28, direction="negative"))
            if row.get("JobSatisfaction") <= 2:
                factors.append(RiskFactorDTO(factor="JobSatisfaction", contribution=0.18, direction="negative"))

            risks.append(EmployeeRiskDTO(
                employeeId=int(row["EmployeeNumber"]),
                employeeName=f"H. Nhân {int(row['EmployeeNumber'])}",
                jobRole=row["JobRole"],
                tenureYears=int(row["YearsAtCompany"]),
                monthlyIncome=int(row["MonthlyIncome"]),
                probability=round(prob, 4),
                riskLevel=risk_lvl,
                riskGroup=group_info["group_name"],
                riskGroupCode=group_info["group_code"],
                color=group_info["color"],
                performanceTier=perf_tier,
                topRiskFactors=factors
            ))

        risks.sort(key=lambda x: x.probability, reverse=True)

        importance = {
            "MonthlyIncome": 0.28,
            "OverTime": 0.22,
            "JobSatisfaction": 0.18,
            "WorkLifeBalance": 0.17,
            "YearsSinceLastPromotion": 0.15
        }

        return DepartmentPredictResponseDTO(
            department={"id": department_name, "name": department_name, "total_employees": len(dept_df)},
            employeeRisks=risks,
            summary=PredictionSummaryDTO(
                highRiskCount=high_cnt,
                mediumRiskCount=mid_cnt,
                lowRiskCount=low_cnt,
                featureImportance=importance
            )
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

        avg_age, avg_income, avg_years = round(df["Age"].mean(), 1), round(df["MonthlyIncome"].mean(), 0), round(df["YearsAtCompany"].mean(), 1)

        dept_stats = [DepartmentStatDTO(department=d, total=len(g), attrited=int((g["Attrition"] == "Yes").sum()), attritionRate=round((g["Attrition"] == "Yes").sum()/len(g)*100, 2)) for d, g in df.groupby("Department")]
        role_stats = [JobRoleStatDTO(jobRole=r, total=len(g), attrited=int((g["Attrition"] == "Yes").sum()), attritionRate=round((g["Attrition"] == "Yes").sum()/len(g)*100, 2)) for r, g in df.groupby("JobRole")]
        role_stats.sort(key=lambda x: x.attritionRate, reverse=True)

        ot_yes, ot_no = df[df["OverTime"] == "Yes"], df[df["OverTime"] == "No"]
        ot_rate = round((ot_yes["Attrition"] == "Yes").sum() / len(ot_yes) * 100, 2)
        non_ot_rate = round((ot_no["Attrition"] == "Yes").sum() / len(ot_no) * 100, 2)

        bins, labels = [18, 25, 30, 35, 40, 45, 50, 55, 61], ["18-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55+"]
        df["AgeBin"] = pd.cut(df["Age"], bins=bins, labels=labels, right=False)
        age_dist = {str(k): int(v) for k, v in sorted(df["AgeBin"].value_counts().to_dict().items(), key=lambda x: x[0])}

        income_labels, income_bins = ["<2K", "2K-5K", "5K-8K", "8K-12K", "12K-20K", "20K+"], [0, 2000, 5000, 8000, 12000, 20000, 999999]
        df["IncomeBin"] = pd.cut(df["MonthlyIncome"], bins=income_bins, labels=income_labels, right=False)
        income_dist = {str(k): int(v) for k, v in df["IncomeBin"].value_counts().to_dict().items()}

        return DashboardSummaryDTO(
            totalEmployees=total, attritionCount=attrited, attritionRate=attrition_rate, avgAge=avg_age, avgMonthlyIncome=avg_income,
            avgYearsAtCompany=avg_years, departmentStats=dept_stats, jobRoleStats=role_stats, overtimeAttritionRate=ot_rate,
            nonOvertimeAttritionRate=non_ot_rate, ageDistribution=age_dist, incomeDistribution=income_dist,
        )

    def get_employee_detail(self, employee_id: int) -> EmployeeDetailDTO:
        """Fetches full details for a single employee."""
        employee = self._loader.get_employee_by_id(employee_id)
        if not employee: raise ValueError(f"Employee with ID {employee_id} not found")
        
        return EmployeeDetailDTO(
            employee_id=employee.employee_id, age=employee.age, gender=employee.gender, marital_status=employee.marital_status,
            department=employee.department, job_role=employee.job_role, job_level=employee.job_level, monthly_income=employee.monthly_income,
            education_field=employee.education_field, total_working_years=employee.total_working_years, years_at_company=employee.years_at_company,
            years_in_current_role=employee.years_in_current_role, years_since_last_promotion=employee.years_since_last_promotion,
            years_with_curr_manager=employee.years_with_curr_manager, over_time=employee.over_time, distance_from_home=employee.distance_from_home,
            business_travel=employee.business_travel, job_satisfaction=employee.job_satisfaction, environment_satisfaction=employee.environment_satisfaction,
            work_life_balance=employee.work_life_balance, performance_rating=employee.performance_rating
        )

import pandas as pd
