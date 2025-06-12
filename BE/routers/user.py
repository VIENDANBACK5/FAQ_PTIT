from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..models import User, Notification, Question, Answer, SaveQuestion
from ..schemas import UserCreate, UserResponse, NotificationResponse
from ..databases import get_db
from ..utils import get_current_user, hash_password

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
def update_user(user_update: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_user = db.query(User).filter(User.id == current_user.id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Kiểm tra trùng username hoặc email
    if user_update.username != current_user.username:
        existing_user = db.query(User).filter(User.username == user_update.username).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already taken")
    if user_update.email != current_user.email:
        existing_user = db.query(User).filter(User.email == user_update.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    # Cập nhật thông tin
    db_user.username = user_update.username
    db_user.email = user_update.email
    if user_update.password:  # Chỉ cập nhật mật khẩu nếu có giá trị mới
        db_user.password = hash_password(user_update.password)
    db_user.avatar = user_update.avatar
    db_user.bio = user_update.bio
    db_user.title = user_update.title
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/me")
def delete_user(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_user = db.query(User).filter(User.id == current_user.id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    return {"detail": "User deleted"}

@router.get("/notifications", response_model=list[NotificationResponse])
def get_notifications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    notifications = db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.created_at.desc()).all()
    return notifications

@router.get("/me/questions")
def get_my_questions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    questions = db.query(Question).filter(Question.user_id == current_user.id).all()
    return questions

@router.get("/me/answers")
def get_my_answers(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    answers = db.query(Answer).filter(Answer.user_id == current_user.id).all()
    return answers

@router.get("/me/saved-questions")
def get_saved_questions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    saved = db.query(SaveQuestion).filter(SaveQuestion.user_id == current_user.id).all()
    question_ids = [s.question_id for s in saved]
    if not question_ids:
        return []
    questions = db.query(Question).filter(Question.id.in_(question_ids)).all()
    return questions

@router.get("/", response_model=list[UserResponse])
def get_all_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Chỉ cho admin lấy toàn bộ user
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Not authorized")
    users = db.query(User).all()
    return users