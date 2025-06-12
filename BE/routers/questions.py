from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from ..models import Question, Tag, QuestionTag, User, SaveQuestion
from ..schemas import QuestionCreate, QuestionResponse, UserResponse
from ..databases import get_db
from ..utils import get_current_user
from sqlalchemy.orm import selectinload
from datetime import datetime

router = APIRouter(prefix="/questions", tags=["questions"])


@router.post("", response_model=QuestionResponse)
def create_question(
    question_data: QuestionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Bắt buộc đăng nhập
):
    # Lấy hoặc tạo mới các tag
    tag_objects = []
    for tag_name in question_data.tags:
        tag = db.query(Tag).filter(Tag.name == tag_name).first()
        if not tag:
            tag = Tag(name=tag_name)
            db.add(tag)
            db.flush()
        tag_objects.append(tag)

    # Tạo câu hỏi, gán user_id
    question = Question(
        title=question_data.title,
        content=question_data.content,
        tags=tag_objects,
        user_id=current_user.id
    )
    db.add(question)
    db.commit()
    db.refresh(question)
    return {
        "id": question.id,
        "title": question.title,
        "content": question.content,
        "tags": [tag.name for tag in question.tags],
        "created_at": str(question.created_at),
        "updated_at": str(question.updated_at) if question.updated_at else None,
        "views": question.views,
        "upvotes": question.upvotes,
        "downvotes": question.downvotes,
        "status": question.status,
        "user": {
            "id": current_user.id,
            "username": current_user.username,
            "email": current_user.email,
            "reputation": current_user.reputation,
            "created_at": str(current_user.created_at) if current_user.created_at else None,
            "role": getattr(current_user, "role", "student"),
        }
    }


@router.get("")
def get_questions(
    db: Session = Depends(get_db),
    page: int = 1,
    pageSize: int = 10,
    sort: str = "newest",
    filter: str = "all"
):
    query = db.query(Question).options(
        selectinload(Question.user),
        selectinload(Question.tags)
    )
    # Có thể bổ sung logic sort/filter ở đây nếu muốn
    total = query.count()
    questions = query.offset((page-1)*pageSize).limit(pageSize).all()
    return {
        "questions": [
            {
                "id": q.id,
                "user_id": q.user_id,
                "title": q.title,
                "content": q.content,
                "views": q.views,
                "upvotes": q.upvotes,
                "downvotes": q.downvotes,
                "status": q.status,
                "user": {
                    "id": 0,
                    "username": "Ẩn danh",
                    "email": "",
                    "reputation": 0,
                    "created_at": None,
                    "role": "student",
                } if q.user is None else {
                    "id": q.user.id,
                    "username": q.user.username,
                    "email": q.user.email,
                    "reputation": q.user.reputation,
                    "created_at": str(q.user.created_at) if q.user.created_at else None,
                    "role": getattr(q.user, "role", "student"),
                },
                "tags": [tag.name for tag in q.tags],
                "created_at": str(q.created_at),
                "updated_at": str(q.updated_at) if q.updated_at else None
            }
            for q in questions
        ],
        "total": total
    }





@router.get("/{question_id}")
def get_question(question_id: int, db: Session = Depends(get_db)):
    question = db.query(Question).options(
        selectinload(Question.user),
        selectinload(Question.tags),
        selectinload(Question.answers)
    ).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    question.views += 1
    db.commit()

    return {
        "success": True,
        "data": {
            "id": question.id,
            "user_id": question.user_id,
            "title": question.title,
            "content": question.content,
            "tags": [tag.name for tag in question.tags],
            "created_at": str(question.created_at),
            "updated_at": str(question.updated_at) if question.updated_at else None,
            "views": question.views,
            "upvotes": question.upvotes,
            "downvotes": question.downvotes,
            "status": question.status,
            "user": {
                "id": question.user.id if question.user else 0,
                "username": question.user.username if question.user else "Ẩn danh",
                "email": question.user.email if question.user else "",
                "reputation": question.user.reputation if question.user else 0,
                "created_at": str(question.user.created_at) if question.user and question.user.created_at else None,
                "role": getattr(question.user, "role", "student") if question.user else "student",
                "avatar": question.user.avatar if question.user else None,
                "bio": question.user.bio if question.user else None,
                "title": question.user.title if question.user else None,
            },
            "answers": [
                {
                    "id": a.id,
                    "content": a.content,
                    "created_at": str(a.created_at),
                    "updated_at": str(a.updated_at),
                    "upvotes": a.upvotes,
                    "downvotes": a.downvotes,
                    "is_accepted": a.is_accepted,
                    "user": {
                        "id": a.user.id if a.user else 0,
                        "username": a.user.username if a.user else "Ẩn danh",
                        "email": a.user.email if a.user else "",
                        "reputation": a.user.reputation if a.user else 0,
                        "created_at": str(a.user.created_at) if a.user and a.user.created_at else None,
                        "role": getattr(a.user, "role", "student") if a.user else "student",
                        "avatar": a.user.avatar if a.user else None,
                        "bio": a.user.bio if a.user else None,
                        "title": a.user.title if a.user else None,
                    }
                } for a in question.answers
            ],
            "answer_count": len(question.answers),
            "has_accepted_answer": any(a.is_accepted for a in question.answers)
        }
    }




@router.put("/{question_id}", response_model=QuestionResponse)
def update_question(question_id: int, question_data: QuestionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if not db_question:
        raise HTTPException(status_code=404, detail="Question not found")
    if db_question.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this question")

    db_question.title = question_data.title
    db_question.content = question_data.content
    db_question.updated_at = datetime.now()  # Cập nhật thời gian sửa
    db_question.tags.clear() 

    tags_to_associate = []
    for tag_name in question_data.tags:
        tag = db.query(Tag).filter(Tag.name == tag_name).first()
        if not tag:
            tag = Tag(name=tag_name)
            db.add(tag)
        tags_to_associate.append(tag)

    db_question.tags.extend(tags_to_associate) 

    db.commit()
    db.refresh(db_question)
    return {
        "id": db_question.id,
        "title": db_question.title,
        "content": db_question.content,
        "tags": [tag.name for tag in db_question.tags],
        "created_at": str(db_question.created_at),
        "updated_at": db_question.updated_at.isoformat() if db_question.updated_at else None,
        "views": db_question.views,
        "upvotes": db_question.upvotes,
        "downvotes": db_question.downvotes,
        "status": db_question.status,
        "user": {
            "id": db_question.user.id if db_question.user else 0,
            "username": db_question.user.username if db_question.user else "Ẩn danh",
            "email": db_question.user.email if db_question.user else "",
            "reputation": db_question.user.reputation if db_question.user else 0,
            "created_at": str(db_question.user.created_at) if db_question.user and db_question.user.created_at else None,
            "role": getattr(db_question.user, "role", "student"),
        }
    }







@router.delete("/{question_id}")
def delete_question(question_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if not db_question:
        raise HTTPException(status_code=404, detail="Question not found")
    if db_question.user_id != current_user.id and getattr(current_user, "role", "user") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to delete this question")
    db.delete(db_question)
    db.commit()
    return {"detail": "Question deleted"}

@router.get("/{question_id}/save-status")
def check_save_status(question_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    saved = db.query(SaveQuestion).filter_by(user_id=current_user.id, question_id=question_id).first()
    return {"isSaved": bool(saved)}

@router.post("/{question_id}/save")
def save_question(question_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    exist = db.query(SaveQuestion).filter_by(user_id=current_user.id, question_id=question_id).first()
    if not exist:
        save = SaveQuestion(user_id=current_user.id, question_id=question_id, create_at=datetime.utcnow())
        db.add(save)
        db.commit()
    return {"detail": "Saved"}

@router.delete("/{question_id}/unsave")
def unsave_question(question_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    save = db.query(SaveQuestion).filter_by(user_id=current_user.id, question_id=question_id).first()
    if save:
        db.delete(save)
        db.commit()
    return {"detail": "Unsaved"}

@router.get("/{question_id}/tags")
def get_tags_of_question(question_id: int, db: Session = Depends(get_db)):
    qtags = db.query(QuestionTag).filter(QuestionTag.question_id == question_id).all()
    tag_ids = [qt.tag_id for qt in qtags]
    tags = db.query(Tag).filter(Tag.id.in_(tag_ids)).all()
    return tags

@router.get("/by_tag/{tag_id}")
def get_questions_by_tag(tag_id: int, db: Session = Depends(get_db)):
    qtags = db.query(QuestionTag).filter(QuestionTag.tag_id == tag_id).all()
    question_ids = [qt.question_id for qt in qtags]
    questions = db.query(Question).filter(Question.id.in_(question_ids)).all()
    return questions

@router.get("/search/{keyword}")
def search_questions(keyword: str, page: int = 1, pageSize: int = 10, db: Session = Depends(get_db)):
    query = db.query(Question).filter(Question.title.ilike(f"%{keyword}%"))
    total = query.count()
    questions = query.offset((page-1)*pageSize).limit(pageSize).all()
    return {"questions": questions, "total": total}

@router.get("/search/suggestions/{keyword}")
def search_suggestions(keyword: str, db: Session = Depends(get_db)):
    # Lấy title chứa keyword
    title_suggestions = db.query(Question.title).filter(Question.title.ilike(f"%{keyword}%")).limit(5).all()
    # Lấy content chứa keyword
    content_suggestions = db.query(Question.content).filter(Question.content.ilike(f"%{keyword}%")).limit(5).all()
    result = []
    title_set = set([s[0] for s in title_suggestions])
    for s in title_suggestions:
        result.append({"type": "title", "text": s[0]})
    for s in content_suggestions:
        content = s[0]
        if content in title_set:
            continue  # Không lặp lại nếu content trùng title
        idx = content.lower().find(keyword.lower())
        if idx != -1:
            start = max(0, idx - 30)
            end = min(len(content), idx + len(keyword) + 30)
            snippet = content[start:end]
            if start > 0:
                snippet = "..." + snippet
            if end < len(content):
                snippet = snippet + "..."
        else:
            snippet = content[:60] + ("..." if len(content) > 60 else "")
        result.append({"type": "content", "text": snippet})
    return result