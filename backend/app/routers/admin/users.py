from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user import User
from app.models.role import Role  # adjust import path to match where your Role model lives
from app.schemas.user import UserCreate
from app.core.security import hash_password
from app.core.deps import admin_required

router = APIRouter(
    prefix="/admin/users",
    tags=["Admin - Users"]
)


# CREATE USER
@router.post("/create")
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    # look up role by name since schema sends role as a string
    role = db.query(Role).filter(Role.role_name == user.role).first()
    if not role:
        raise HTTPException(status_code=400, detail="Invalid role")

    new_user = User(
        username=user.username,
        password=hash_password(user.password),
        role_id=role.id,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully"}


# ASSIGN ROLE TO USER
@router.post("/assign-role")
def assign_role(
    user_id: int,
    role_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.role_id = role_id

    db.commit()

    return {"message": "Role assigned successfully"}


# GET ALL USERS (ADMIN VIEW)
@router.get("/")
def get_users(
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):

    return db.query(User).all()