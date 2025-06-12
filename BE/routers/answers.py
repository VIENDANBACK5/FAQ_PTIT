from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..models import Answer, Question, User
from ..schemas import AnswerCreate, AnswerResponse, UserResponse
from ..databases import get_db
from ..utils import get_current_user
from sqlalchemy.orm import selectinload


router = APIRouter(prefix="/answers", tags=["answers"])

@router.post("")
def create_answer(answer: AnswerCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    question = db.query(Question).filter(Question.id == answer.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    new_answer = Answer(question_id=answer.question_id, user_id=current_user.id, content=answer.content)
    db.add(new_answer)
    db.commit()
    db.refresh(new_answer)
    return new_answer

@router.get("/question/{question_id}", response_model=List[AnswerResponse])
def get_answers(question_id: int, db: Session = Depends(get_db)):
    answers = db.query(Answer).options(
        selectinload(Answer.user) # Eager load user
    ).filter(Answer.question_id == question_id).all()
    return answers

@router.put("/{id}")
def update_answer(id: int, answer: AnswerCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_answer = db.query(Answer).filter(Answer.id == id).first()
    if not db_answer:
        raise HTTPException(status_code=404, detail="Khong tim thay cau tra loi")
    if db_answer.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this answer")
    db_answer.content = answer.content
    db.commit()
    db.refresh(db_answer)
    return db_answer

@router.delete("/{id}")
def delete_answer(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_answer = db.query(Answer).filter(Answer.id == id).first()
    if not db_answer:
        raise HTTPException(status_code=404, detail="Khong tim thay cau tra loi")
    if db_answer.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this answer")
    db.delete(db_answer)
    db.commit()
    return {"detail": "Answer deleted"}

@router.post("/{id}/accept")
def accept_answer(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_answer = db.query(Answer).filter(Answer.id == id).first()
    if not db_answer:
        raise HTTPException(status_code=404, detail="Answer not found")
    question = db.query(Question).filter(Question.id == db_answer.question_id).first()
    if question.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only question owner can accept an answer")
    db.query(Answer).filter(Answer.question_id == db_answer.question_id).update({"is_accepted": False})
    db_answer.is_accepted = True
    db.commit()
    return {"detail": "Answer accepted"}

@router.post("/{id}/not_accept")
def not_accept_answer(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_answer = db.query(Answer).filter(Answer.id == id).first()
    if not db_answer:
        raise HTTPException(status_code=404, detail="Answer not found")
    db_answer.is_accepted = False
    db.commit()
    return {"detail": "Answer not accepted"}
