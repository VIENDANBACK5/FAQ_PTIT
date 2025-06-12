from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from ..models import Tag, User, FollowTag, QuestionTag
from ..schemas import TagCreate, TagResponse
from ..databases import get_db
from ..utils import get_current_user
from datetime import datetime

router = APIRouter(prefix="/tags", tags=["tags"])

@router.post("", response_model=TagResponse)
def create_tag(tag: TagCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing_tag = db.query(Tag).filter(Tag.name == tag.name).first()
    if existing_tag:
        raise HTTPException(status_code=400, detail="Tag already exists")
    new_tag = Tag(name=tag.name, description=tag.description)
    db.add(new_tag)
    db.commit()
    db.refresh(new_tag)
    return new_tag

@router.get("", response_model=List[TagResponse])
def get_tags(db: Session = Depends(get_db)):
    tags = db.query(Tag).all()
    return tags

@router.get("/with_count")
def get_tags_with_count(db: Session = Depends(get_db)):
    tag_counts = (
        db.query(Tag.id, Tag.name, func.count(QuestionTag.question_id).label("count"))
        .outerjoin(QuestionTag, Tag.id == QuestionTag.tag_id)
        .group_by(Tag.id)
        .all()
    )
    return [
        {"id": t.id, "name": t.name, "count": t.count}
        for t in tag_counts
    ]

# --- FOLLOW TAGS ---
@router.get("/followed")
def get_followed_tags(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    follows = db.query(FollowTag).filter(FollowTag.user_id == current_user.id).all()
    tag_ids = [f.tag_id for f in follows]
    tags = db.query(Tag).filter(Tag.id.in_(tag_ids)).all()
    return tags

@router.post("/follow/{tag_id}")
def follow_tag(tag_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    exist = db.query(FollowTag).filter_by(user_id=current_user.id, tag_id=tag_id).first()
    if not exist:
        follow = FollowTag(user_id=current_user.id, tag_id=tag_id, create_at=datetime.utcnow())
        db.add(follow)
        db.commit()
    return {"detail": "Followed"}

@router.delete("/follow/{tag_id}")
def unfollow_tag(tag_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    follow = db.query(FollowTag).filter_by(user_id=current_user.id, tag_id=tag_id).first()
    if follow:
        db.delete(follow)
        db.commit()
    return {"detail": "Unfollowed"}

@router.get("/search")
def search_tags(keyword: str, db: Session = Depends(get_db)):
    tags = db.query(Tag).filter(Tag.name.ilike(f"%{keyword}%")).all()
    return tags