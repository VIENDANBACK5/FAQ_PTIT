from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import Optional, List
from pydantic import field_serializer
from pydantic import model_validator
from enum import Enum

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    avatar: Optional[str] = None
    bio: Optional[str] = None
    title: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime
    reputation: int
    role: str
    avatar: Optional[str] = None
    bio: Optional[str] = None
    title: Optional[str] = None

    class Config:
        from_attributes = True

class QuestionCreate(BaseModel):
    title: str
    content: str
    tags: List[str]

class QuestionResponse(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime
    updated_at: datetime
    views: int
    upvotes: int
    downvotes: int
    status: str
    user: UserResponse
    tags: List[str]

    class Config:
        from_attributes = True

    @field_serializer('tags')
    def serialize_tags(self, tags_from_orm, _info):
        if isinstance(tags_from_orm, list) and all(hasattr(item, 'name') for item in tags_from_orm):
            return [tag.name for tag in tags_from_orm]
        return tags_from_orm 

class AnswerCreate(BaseModel):
    question_id: int
    content: str

class AnswerResponse(BaseModel):
    id: int
    question_id: int
    content: str
    created_at: datetime
    updated_at: datetime
    upvotes: int
    downvotes: int
    is_accepted: bool
    user: UserResponse

    class Config:
        from_attributes = True

class CommentCreate(BaseModel):
    content: str
    question_id: Optional[int] = None
    answer_id: Optional[int] = None

    @model_validator(mode='after') 
    def check_exclusive_ids(self) -> 'CommentCreate':
        if self.question_id is not None and self.answer_id is not None:
            raise ValueError('Only one of question_id or answer_id can be provided')
        if self.question_id is None and self.answer_id is None:
            raise ValueError('One of question_id or answer_id must be provided')
        return self

class CommentResponse(BaseModel):
    id: int
    content: str
    created_at: datetime
    user: UserResponse
    question_id: Optional[int]
    answer_id: Optional[int]

    class Config:
        from_attributes = True

class VoteCreate(BaseModel):
    vote_type: str # Should be Enum for better validation e.g. Literal["up", "down"]
    question_id: Optional[int] = None
    answer_id: Optional[int] = None

    @model_validator(mode='after')
    def check_exclusive_ids(self) -> 'VoteCreate':
        if self.question_id is not None and self.answer_id is not None:
            raise ValueError('Only one of question_id or answer_id can be provided')
        if self.question_id is None and self.answer_id is None:
            raise ValueError('One of question_id or answer_id must be provided')
        return self
    
class VoteType(str, Enum):
    up = "up"
    down = "down"
    
class VoteResponse(BaseModel):
    vote_type: VoteType

class TagCreate(BaseModel):
    name: str
    description: Optional[str] = None

class TagResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class NotificationResponse(BaseModel):
    id: int
    user_id: int
    content: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

