import logging
import pandas as pd
from typing import List, Optional
from sqlalchemy.orm import Session
from io import BytesIO

from app.infrastructure.models import Employee
from app.application.dtos import EmployeeCreateDTO, EmployeeUpdateDTO, EmployeeDetailDTO

logger = logging.getLogger(__name__)

class EmployeeService:
    def __init__(self, db: Session):
        self.db = db

    def get_all_employees(self) -> List[EmployeeDetailDTO]:
        employees = self.db.query(Employee).all()
        return [self._map_to_detail_dto(e) for e in employees]

    def get_employee_by_id(self, employee_id: int) -> Optional[EmployeeDetailDTO]:
        employee = self.db.query(Employee).filter(Employee.employee_id == employee_id).first()
        if employee:
            return self._map_to_detail_dto(employee)
        return None

    def create_employee(self, dto: EmployeeCreateDTO) -> EmployeeDetailDTO:
        employee = Employee(**dto.model_dump())
        self.db.add(employee)
        self.db.commit()
        self.db.refresh(employee)
        return self._map_to_detail_dto(employee)

    def update_employee(self, employee_id: int, dto: EmployeeUpdateDTO) -> Optional[EmployeeDetailDTO]:
        employee = self.db.query(Employee).filter(Employee.employee_id == employee_id).first()
        if not employee:
            return None
        
        update_data = dto.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(employee, key, value)
        
        self.db.commit()
        self.db.refresh(employee)
        return self._map_to_detail_dto(employee)

    def delete_employee(self, employee_id: int) -> bool:
        employee = self.db.query(Employee).filter(Employee.employee_id == employee_id).first()
        if not employee:
            return False
        
        self.db.delete(employee)
        self.db.commit()
        return True

    def import_from_excel(self, file_content: bytes) -> int:
        """Imports employees from an Excel file (.xlsx or .xls)."""
        try:
            df = pd.read_excel(BytesIO(file_content))
            return self._process_dataframe(df)
        except Exception as e:
            logger.error(f"Error importing Excel: {str(e)}")
            raise ValueError(f"Could not read Excel file: {str(e)}")

    def import_from_csv(self, file_content: bytes) -> int:
        """Imports employees from a CSV file."""
        try:
            df = pd.read_csv(BytesIO(file_content))
            return self._process_dataframe(df)
        except Exception as e:
            logger.error(f"Error importing CSV: {str(e)}")
            raise ValueError(f"Could not read CSV file: {str(e)}")

    def _process_dataframe(self, df: pd.DataFrame) -> int:
        """Processes the dataframe and saves records to DB."""
        # Map CSV/Excel column names to database field names if necessary
        # Assuming the file uses snake_case or PascalCase matching the model
        
        # Mapping table for PascalCase (from CSV) to snake_case (Model)
        column_mapping = {
            "Age": "age",
            "Attrition": "attrition",
            "BusinessTravel": "business_travel",
            "DailyRate": "daily_rate",
            "Department": "department",
            "DistanceFromHome": "distance_from_home",
            "Education": "education",
            "EducationField": "education_field",
            "EmployeeNumber": "employee_id",
            "EnvironmentSatisfaction": "environment_satisfaction",
            "Gender": "gender",
            "HourlyRate": "hourly_rate",
            "JobInvolvement": "job_involvement",
            "JobLevel": "job_level",
            "JobRole": "job_role",
            "JobSatisfaction": "job_satisfaction",
            "MaritalStatus": "marital_status",
            "MonthlyIncome": "monthly_income",
            "MonthlyRate": "monthly_rate",
            "NumCompaniesWorked": "num_companies_worked",
            "OverTime": "over_time",
            "PercentSalaryHike": "percent_salary_hike",
            "PerformanceRating": "performance_rating",
            "RelationshipSatisfaction": "relationship_satisfaction",
            "StockOptionLevel": "stock_option_level",
            "TotalWorkingYears": "total_working_years",
            "TrainingTimesLastYear": "training_times_last_year",
            "WorkLifeBalance": "work_life_balance",
            "YearsAtCompany": "years_at_company",
            "YearsInCurrentRole": "years_in_current_role",
            "YearsSinceLastPromotion": "years_since_last_promotion",
            "YearsWithCurrManager": "years_with_curr_manager"
        }
        
        df = df.rename(columns=column_mapping)
        
        count = 0
        for _, row in df.iterrows():
            data = row.to_dict()
            # Filter only valid fields for the model
            valid_data = {k: v for k, v in data.items() if hasattr(Employee, k)}
            
            # Check if employee already exists
            existing = None
            if "employee_id" in valid_data and valid_data["employee_id"]:
                existing = self.db.query(Employee).filter(Employee.employee_id == int(valid_data["employee_id"])).first()
            
            if existing:
                for k, v in valid_data.items():
                    setattr(existing, k, v)
            else:
                new_emp = Employee(**valid_data)
                self.db.add(new_emp)
            
            count += 1
            if count % 100 == 0:
                self.db.flush()
        
        self.db.commit()
        return count

    def _map_to_detail_dto(self, emp: Employee) -> EmployeeDetailDTO:
        return EmployeeDetailDTO(
            employee_id=emp.employee_id,
            age=emp.age or 0,
            gender=emp.gender or "Unknown",
            marital_status=emp.marital_status or "Unknown",
            department=emp.department or "Unknown",
            job_role=emp.job_role or "Unknown",
            job_level=emp.job_level or 1,
            monthly_income=emp.monthly_income or 0,
            education_field=emp.education_field or "Unknown",
            total_working_years=emp.total_working_years or 0,
            years_at_company=emp.years_at_company or 0,
            years_in_current_role=emp.years_in_current_role or 0,
            years_since_last_promotion=emp.years_since_last_promotion or 0,
            years_with_curr_manager=emp.years_with_curr_manager or 0,
            over_time=emp.over_time or "No",
            distance_from_home=emp.distance_from_home or 0,
            business_travel=emp.business_travel or "Non-Travel",
            job_satisfaction=emp.job_satisfaction or 3,
            environment_satisfaction=emp.environment_satisfaction or 3,
            work_life_balance=emp.work_life_balance or 3,
            performance_rating=emp.performance_rating or 3
        )
