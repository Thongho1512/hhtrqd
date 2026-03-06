import pandas as pd
from sqlalchemy import create_engine
from app.infrastructure.database import SessionLocal, engine
from app.infrastructure.models import Base, Employee
import os

def migrate_csv_to_db():
    print("Starting data migration...")
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    print("Tables created or already exist.")

    # Load CSV
    csv_path = os.path.join("..", "WA_Fn-UseC_-HR-Employee-Attrition.csv")
    if not os.path.exists(csv_path):
        print(f"CSV file not found at {csv_path}")
        return

    df = pd.read_csv(csv_path)
    print(f"Loaded {len(df)} records from CSV.")

    db = SessionLocal()
    try:
        # Check if already migrated
        if db.query(Employee).count() > 0:
            print("Data already exists in database. Skipping migration.")
            return

        # Prepare records
        # Mapping CSV headers (PascalCase) to Model fields (snake_case)
        # Note: EmployeeNumber in CSV is used as employee_id
        records = []
        for _, row in df.iterrows():
            employee = Employee(
                employee_id=int(row['EmployeeNumber']),
                age=int(row['Age']),
                attrition=row['Attrition'],
                business_travel=row['BusinessTravel'],
                daily_rate=int(row['DailyRate']),
                department=row['Department'],
                distance_from_home=int(row['DistanceFromHome']),
                education=int(row['Education']),
                education_field=row['EducationField'],
                environment_satisfaction=int(row['EnvironmentSatisfaction']),
                gender=row['Gender'],
                hourly_rate=int(row['HourlyRate']),
                job_involvement=int(row['JobInvolvement']),
                job_level=int(row['JobLevel']),
                job_role=row['JobRole'],
                job_satisfaction=int(row['JobSatisfaction']),
                marital_status=row['MaritalStatus'],
                monthly_income=int(row['MonthlyIncome']),
                monthly_rate=int(row['MonthlyRate']),
                num_companies_worked=int(row['NumCompaniesWorked']),
                over_time=row['OverTime'],
                percent_salary_hike=int(row['PercentSalaryHike']),
                performance_rating=int(row['PerformanceRating']),
                relationship_satisfaction=int(row['RelationshipSatisfaction']),
                stock_option_level=int(row['StockOptionLevel']),
                total_working_years=int(row['TotalWorkingYears']),
                training_times_last_year=int(row['TrainingTimesLastYear']),
                work_life_balance=int(row['WorkLifeBalance']),
                years_at_company=int(row['YearsAtCompany']),
                years_in_current_role=int(row['YearsInCurrentRole']),
                years_since_last_promotion=int(row['YearsSinceLastPromotion']),
                years_with_curr_manager=int(row['YearsWithCurrManager'])
            )
            records.append(employee)

        db.add_all(records)
        db.commit()
        print(f"Successfully migrated {len(records)} records to PostgreSQL.")
    except Exception as e:
        db.rollback()
        print(f"Migration failed: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    migrate_csv_to_db()
