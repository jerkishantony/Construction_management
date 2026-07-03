from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user import User
from app.models.role import Role
from app.schemas.user import UserLogin
from app.core.security import verify_password, create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(
        User.username == user.username
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=400,
            detail="Invalid credentials"
        )

    if not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=400,
            detail="Invalid credentials"
        )

    role_obj = db.query(Role).filter(
        Role.id == db_user.role_id
    ).first()

    token_data = {
        "user_id": db_user.id,
        "username": db_user.username,
        "role": role_obj.role_name if role_obj else None,
        "role_id": db_user.role_id,

        # NEW
        "show_all_menus": db_user.show_all_menus
    }

    token = create_access_token(data=token_data)

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": role_obj.role_name if role_obj else None,
        "role_id": db_user.role_id,

        # Optional - useful for frontend if needed
        "show_all_menus": db_user.show_all_menus
    }