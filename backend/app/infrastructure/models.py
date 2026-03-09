from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="viewer")

class Employee(Base):
    __tablename__ = "employees"

    employee_id = Column(Integer, primary_key=True, index=True)
    age = Column(Integer)
    attrition = Column(String)
    business_travel = Column(String)
    daily_rate = Column(Integer)
    department = Column(String)
    distance_from_home = Column(Integer)
    education = Column(Integer)
    education_field = Column(String)
    environment_satisfaction = Column(Integer)
    gender = Column(String)
    hourly_rate = Column(Integer)
    job_involvement = Column(Integer)
    job_level = Column(Integer)
    job_role = Column(String)
    job_satisfaction = Column(Integer)
    marital_status = Column(String)
    monthly_income = Column(Integer)
    monthly_rate = Column(Integer)
    num_companies_worked = Column(Integer)
    over_time = Column(String)
    percent_salary_hike = Column(Integer)
    performance_rating = Column(Integer)
    relationship_satisfaction = Column(Integer)
    stock_option_level = Column(Integer)
    total_working_years = Column(Integer)
    training_times_last_year = Column(Integer)
    work_life_balance = Column(Integer)
    years_at_company = Column(Integer)
    years_in_current_role = Column(Integer)
    years_since_last_promotion = Column(Integer)
    years_with_curr_manager = Column(Integer)
    
    # AHP Results
    strategy_group = Column(String, nullable=True)
    strategy_option_id = Column(String, nullable=True)
    ahp_score = Column(Float, nullable=True)
    ahp_rank = Column(Integer, nullable=True)
    attention_level = Column(Integer, default=1) # 1-normal, 5-extreme

class PredictionResult(Base):
    __tablename__ = "prediction_results"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.employee_id"))
    prediction = Column(String)
    probability = Column(Float)
    model_version = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
class Note(Base):
    __tablename__ = "notes"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.employee_id"))
    content = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    author = Column(String, default="User")
