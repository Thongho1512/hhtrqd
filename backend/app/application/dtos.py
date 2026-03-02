"""
Application-layer DTOs (Data Transfer Objects).
Used to pass data between API layer and application services.
"""
from typing import Optional, Any, Dict
from pydantic import BaseModel, Field


# --------------------------------------------------------------------------- #
#  Training DTOs
# --------------------------------------------------------------------------- #

class TrainResponseDTO(BaseModel):
    """Response returned after training the ML model."""
    accuracy: float = Field(..., description="Overall accuracy on the test set")
    auc: float = Field(..., description="ROC-AUC score")
    f1Score: float = Field(..., description="F1 score for the positive class (Attrition=Yes)")
    modelVersion: str = Field(..., description="Version tag of the saved model")
    trainingTime: float = Field(..., description="Wall-clock training time in seconds")
    confusionMatrix: Optional[Dict[str, Any]] = Field(None, description="Confusion matrix breakdown")


# --------------------------------------------------------------------------- #
#  Prediction DTOs
# --------------------------------------------------------------------------- #

class PredictRequestDTO(BaseModel):
    """Input features for a single employee prediction."""
    Age: int = Field(..., ge=18, le=65, example=35)
    BusinessTravel: str = Field(..., example="Travel_Rarely")
    DailyRate: int = Field(..., ge=100, le=1500, example=802)
    Department: str = Field(..., example="Research & Development")
    DistanceFromHome: int = Field(..., ge=1, le=30, example=5)
    Education: int = Field(..., ge=1, le=5, example=3)
    EducationField: str = Field(..., example="Life Sciences")
    EnvironmentSatisfaction: int = Field(..., ge=1, le=4, example=3)
    Gender: str = Field(..., example="Male")
    HourlyRate: int = Field(..., ge=30, le=100, example=65)
    JobInvolvement: int = Field(..., ge=1, le=4, example=3)
    JobLevel: int = Field(..., ge=1, le=5, example=2)
    JobRole: str = Field(..., example="Sales Executive")
    JobSatisfaction: int = Field(..., ge=1, le=4, example=3)
    MaritalStatus: str = Field(..., example="Single")
    MonthlyIncome: int = Field(..., ge=1000, le=20000, example=5000)
    MonthlyRate: int = Field(..., ge=2000, le=27000, example=15000)
    NumCompaniesWorked: int = Field(..., ge=0, le=9, example=2)
    OverTime: str = Field(..., example="Yes")
    PercentSalaryHike: int = Field(..., ge=11, le=25, example=13)
    PerformanceRating: int = Field(..., ge=3, le=4, example=3)
    RelationshipSatisfaction: int = Field(..., ge=1, le=4, example=3)
    StockOptionLevel: int = Field(..., ge=0, le=3, example=1)
    TotalWorkingYears: int = Field(..., ge=0, le=40, example=8)
    TrainingTimesLastYear: int = Field(..., ge=0, le=6, example=3)
    WorkLifeBalance: int = Field(..., ge=1, le=4, example=3)
    YearsAtCompany: int = Field(..., ge=0, le=40, example=5)
    YearsInCurrentRole: int = Field(..., ge=0, le=18, example=3)
    YearsSinceLastPromotion: int = Field(..., ge=0, le=15, example=1)
    YearsWithCurrManager: int = Field(..., ge=0, le=17, example=4)


class PredictResponseDTO(BaseModel):
    """Result of an attrition prediction."""
    willAttrite: bool = Field(..., description="True if employee is predicted to leave")
    probability: float = Field(..., description="Probability of attrition [0, 1]")
    riskLevel: str = Field(..., description="LOW | MEDIUM | HIGH based on probability")


# --------------------------------------------------------------------------- #
#  Dashboard DTOs
# --------------------------------------------------------------------------- #

class DepartmentStatDTO(BaseModel):
    department: str
    total: int
    attrited: int
    attritionRate: float


class JobRoleStatDTO(BaseModel):
    jobRole: str
    total: int
    attrited: int
    attritionRate: float


class DashboardSummaryDTO(BaseModel):
    totalEmployees: int
    attritionCount: int
    attritionRate: float
    avgAge: float
    avgMonthlyIncome: float
    avgYearsAtCompany: float
    departmentStats: list[DepartmentStatDTO]
    jobRoleStats: list[JobRoleStatDTO]
    overtimeAttritionRate: float
    nonOvertimeAttritionRate: float
    ageDistribution: Dict[str, int]
    incomeDistribution: Dict[str, int]
