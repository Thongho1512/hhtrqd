import sys
import os

# Add the app directory to sys.path to allow imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from app.infrastructure.database import engine

def add_columns():
    print("Connecting to database to add missing AHP columns...")
    
    # Missing columns list
    columns_to_add = [
        ("strategy_group", "VARCHAR"),
        ("strategy_option_id", "VARCHAR"),
        ("ahp_score", "DOUBLE PRECISION"),
        ("ahp_rank", "INTEGER"),
        ("attention_level", "INTEGER DEFAULT 1")
    ]
    
    try:
        with engine.connect() as conn:
            # Check existing columns
            result = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'employees'"))
            existing_columns = [row[0] for row in result]
            
            for col_name, col_type in columns_to_add:
                if col_name not in existing_columns:
                    print(f"Adding column: {col_name} ({col_type})")
                    conn.execute(text(f"ALTER TABLE employees ADD COLUMN {col_name} {col_type}"))
                else:
                    print(f"Column already exists: {col_name}")
            
            conn.commit()
            print("Successfully updated employees table schema.")
            
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    add_columns()
