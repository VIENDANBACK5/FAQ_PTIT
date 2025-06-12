from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
import os

# Chuỗi kết nối tới cơ sở dữ liệu MySQL
load_dotenv(dotenv_path="d:/code/BTLWEB/BE_THLT_WEB/.env")
URL_DATABASE = os.getenv("DATABASE_URL")

# Tạo engine cho kết nối
engine = create_engine(URL_DATABASE)

# Tạo session để tương tác với cơ sở dữ liệu
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Cơ sở khai báo cho các mô hình
Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()