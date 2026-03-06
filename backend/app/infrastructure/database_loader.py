import logging
import pandas as pd
from sqlalchemy.orm import Session
from app.application.interfaces.interfaces import ICSVLoader
from app.infrastructure.database import SessionLocal
from app.infrastructure.models import Employee

logger = logging.getLogger(__name__)

class PostgresEmployeeLoader(ICSVLoader):
    """
    Concrete implementation of employee loader using PostgreSQL.
    Reads employee records from the database and returns a DataFrame.
    """

    def load(self) -> pd.DataFrame:
        """Load all employees from the database and return as a DataFrame."""
        db: Session = SessionLocal()
        try:
            employees = db.query(Employee).all()
            
            # Map SQLAlchemy models to list of dicts with PascalCase keys for compatibility
            data = []
            for emp in employees:
                data.append({
                    "Age": emp.age,
                    "Attrition": emp.attrition,
                    "BusinessTravel": emp.business_travel,
                    "DailyRate": emp.daily_rate,
                    "Department": emp.department,
                    "DistanceFromHome": emp.distance_from_home,
                    "Education": emp.education,
                    "EducationField": emp.education_field,
                    "EmployeeNumber": emp.employee_id,
                    "EnvironmentSatisfaction": emp.environment_satisfaction,
                    "Gender": emp.gender,
                    "HourlyRate": emp.hourly_rate,
                    "JobInvolvement": emp.job_involvement,
                    "JobLevel": emp.job_level,
                    "JobRole": emp.job_role,
                    "JobSatisfaction": emp.job_satisfaction,
                    "MaritalStatus": emp.marital_status,
                    "MonthlyIncome": emp.monthly_income,
                    "MonthlyRate": emp.monthly_rate,
                    "NumCompaniesWorked": emp.num_companies_worked,
                    "OverTime": emp.over_time,
                    "PercentSalaryHike": emp.percent_salary_hike,
                    "PerformanceRating": emp.performance_rating,
                    "RelationshipSatisfaction": emp.relationship_satisfaction,
                    "StockOptionLevel": emp.stock_option_level,
                    "TotalWorkingYears": emp.total_working_years,
                    "TrainingTimesLastYear": emp.training_times_last_year,
                    "WorkLifeBalance": emp.work_life_balance,
                    "YearsAtCompany": emp.years_at_company,
                    "YearsInCurrentRole": emp.years_in_current_role,
                    "YearsSinceLastPromotion": emp.years_since_last_promotion,
                    "YearsWithCurrManager": emp.years_with_curr_manager
                })
            
            df = pd.DataFrame(data)
            logger.info("Loaded %d employee records from PostgreSQL database.", len(df))
            
            if len(df) == 0:
                logger.warning("PostgreSQL database is empty. Returning empty DataFrame.")
                
            return df
        except Exception as e:
            logger.exception("Failed to load employees from database")
            raise RuntimeError(f"Database error: {str(e)}")
        finally:
            db.close()

    def get_employee_by_id(self, employee_id: int) -> Employee:
        """Retrieve a single employee record from Postgres by ID."""
        db: Session = SessionLocal()
        try:
            return db.query(Employee).filter(Employee.employee_id == employee_id).first()
        finally:
            db.close()
