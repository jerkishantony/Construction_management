from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.core.deps import get_current_user

from app.services.user.menu.menu_service import get_my_menus

router = APIRouter(
    prefix="/user",
    tags=["User"]
)


@router.get("/my-menus")
def my_menus(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_my_menus(
        db,
        current_user["user_id"]
    )