"""
Domain entity: EmployeeRecord
Represents the raw structure of an HR employee record from the IBM dataset.
"""
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class EmployeeRecord:
    """
    Core domain entity representing a single employee record.
    All fields mirror the IBM HR Attrition dataset columns.
    """
    age: int
    attrition: Optional[str]  # 'Yes' / 'No' (None when used for prediction)
    business_travel: str
    daily_rate: int
    department: str
    distance_from_home: int
    education: int
    education_field: str
    employee_count: int
    employee_number: int
    environment_satisfaction: int
    gender: str
    hourly_rate: int
    job_involvement: int
    job_level: int
    job_role: str
    job_satisfaction: int
    marital_status: str
    monthly_income: int
    monthly_rate: int
    num_companies_worked: int
    over18: str
    over_time: str
    percent_salary_hike: int
    performance_rating: int
    relationship_satisfaction: int
    standard_hours: int
    stock_option_level: int
    total_working_years: int
    training_times_last_year: int
    work_life_balance: int
    years_at_company: int
    years_in_current_role: int
    years_since_last_promotion: int
    years_with_curr_manager: int
