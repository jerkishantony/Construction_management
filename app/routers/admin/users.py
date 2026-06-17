from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import hash_password
from app.core.deps import admin_required

router = APIRouter(
    prefix="/admin/users",
    tags=["Admin - Users"]
)

@router.post("/create")
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):

    new_user = User(
        username=user.username,
        password=hash_password(user.password),
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully"}