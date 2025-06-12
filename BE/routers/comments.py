from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..models import Comment, Question, Answer, User
from ..schemas import CommentCreate, CommentResponse, UserResponse
from ..databases import get_db
from ..utils import get_current_user
from sqlalchemy.orm import selectinload


router = APIRouter(prefix="/comments", tags=["comments"])

@router.post("")
def create_comment(comment: CommentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if comment.question_id is not None and comment.answer_id is not None:
        raise HTTPException(status_code=400, detail="Only one of question_id or answer_id can be provided")
    if comment.question_id is None and comment.answer_id is None:
        raise HTTPException(status_code=400, detail="One of question_id or answer_id must be provided")
    
    if comment.question_id:
        question = db.query(Question).filter(Question.id == comment.question_id).first()
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")
        new_comment = Comment(content=comment.content, question_id=comment.question_id, user_id=current_user.id)
    elif comment.answer_id:
        answer = db.query(Answer).filter(Answer.id == comment.answer_id).first()
        if not answer:
            raise HTTPException(status_code=404, detail="Answer not found")
        new_comment = Comment(content=comment.content, answer_id=comment.answer_id, user_id=current_user.id)
    
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return {"success": True, "data": new_comment}

@router.get("", response_model=List[CommentResponse])
def get_comments(db: Session = Depends(get_db)): 
    comments = db.query(Comment).options(
        selectinload(Comment.user) 
    ).all()
    return comments

@router.put("/{comment_id}", response_model=CommentResponse)
def update_comment(comment_id: int, comment: CommentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not db_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if db_comment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this comment")
    db_comment.content = comment.content
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.delete("/{comment_id}")
def delete_comment(comment_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not db_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if db_comment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this comment")
    db.delete(db_comment)
    db.commit()
    return {"detail": "Comment deleted"}