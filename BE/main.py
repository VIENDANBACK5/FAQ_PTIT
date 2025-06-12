from BE_THLT_WEB.routers import auth_router, questions_router, answers_router, comments_router, votes_router, tags_router, user_router
from BE_THLT_WEB.databases import engine
from BE_THLT_WEB import models
from BE_THLT_WEB import utils
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
import os

current_file_directory = os.path.dirname(os.path.abspath(__file__))
dotenv_path = os.path.join(current_file_directory, '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path=dotenv_path, verbose=True) # Tải với đường dẫn cụ thể
else:
    print(f"DEBUG: .env file NOT FOUND at: {dotenv_path}")

loaded_secret_key = os.getenv("SECRET_KEY")




app = FastAPI(title="Diễn đàn Hỏi Đáp Sinh Viên")



if loaded_secret_key: # Chỉ thực hiện các tác vụ phụ thuộc vào SECRET_KEY nếu nó đã được tải
    from . import utils # Import utils ở đây nếu nó phụ thuộc vào SECRET_KEY đã load


    app.include_router(auth_router)
    app.include_router(questions_router)
    app.include_router(answers_router)
    app.include_router(comments_router)
    app.include_router(votes_router)
    app.include_router(tags_router)
    app.include_router(user_router)


    app.add_middleware(
    CORSMiddleware,
    # allow_origins=["https://lustrous-crostata-252b3f.netlify.app", "http://localhost"],
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Chào mừng đến với diễn đàn hỏi đáp sinh viên!"}

if not loaded_secret_key:
    print("\n!!! LỖI NGHIÊM TRỌNG: SECRET_KEY không được tải. Ứng dụng có thể không hoạt động đúng cách. !!!\n")