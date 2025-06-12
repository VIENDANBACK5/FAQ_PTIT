from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..models import Vote, Question, Answer, User
from ..schemas import VoteCreate, VoteResponse , VoteType
from ..databases import get_db
from ..utils import get_current_user


router = APIRouter(prefix="/votes", tags=["votes"])


@router.post("", response_model=VoteCreate)
def create_vote(vote: VoteCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if vote.question_id:
        target = db.query(Question).filter(Question.id == vote.question_id).first()
        if not target:
            raise HTTPException(status_code=404, detail="Question not found")
        existing_vote = db.query(Vote).filter(
            Vote.user_id == current_user.id,
            Vote.question_id == vote.question_id
        ).first()
    elif vote.answer_id:
        target = db.query(Answer).filter(Answer.answer_id == vote.answer_id).first()
        if not target:
            raise HTTPException(status_code=404, detail="Answer not found")
        existing_vote = db.query(Vote).filter(
            Vote.user_id == current_user.id,
            Vote.answer_id == vote.answer_id
        ).first()
    
    if existing_vote:
        if existing_vote.vote_type == vote.vote_type:
            raise HTTPException(status_code=400, detail="You have already voted this way")
        db.delete(existing_vote)
        if vote.question_id:
            if existing_vote.vote_type == "up":
                target.upvotes -= 1
            else:
                target.downvotes -= 1
        else:
            if existing_vote.vote_type == "up":
                target.upvotes -= 1
            else:
                target.downvotes -= 1
    
    if vote.vote_type == "up":
        vote_type_int = 1
    elif vote.vote_type == "down":
        vote_type_int = -1
    else:
        raise ValueError("vote_type phải là 'up' hoặc 'down'")
    
    new_vote = Vote(
        user_id=current_user.id,
        vote_type=vote_type_int,
        question_id=vote.question_id,
        answer_id=vote.answer_id
    )
    if vote.question_id:
        if vote_type_int == 1:
            target.upvotes += 1
        else:
            target.downvotes += 1
    else:
        if vote_type_int == 1:
            target.upvotes += 1
        else:
            target.downvotes += 1
    
    db.add(new_vote)
    db.commit()
    return vote

def int_to_vote_type(vote_type_int):
    return "up" if vote_type_int == 1 else "down"