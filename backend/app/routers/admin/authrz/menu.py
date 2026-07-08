from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.core.deps import get_current_user

from app.models.admin.pages.user import User

from app.services.admin.menu.menu_service import get_menus_by_role

from app.schemas.admin.show_all_menu import ShowAllMenuRequest

router = APIRouter(
    prefix="/admin/menus",
    tags=["Admin - Menus"]
)


@router.get("/")
def get_menus(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # Always get the latest user data from DB
    db_user = (
        db.query(User)
        .filter(User.id == current_user["user_id"])
        .first()
    )

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    menus = get_menus_by_role(
        db=db,
        role_id=db_user.role_id,
        role_name=db_user.role.role_name,
        show_all_menus=db_user.show_all_menus,
    )

    return {
        "success": True,
        "message": "Menus fetched successfully",
        "show_all_menus": db_user.show_all_menus,
        "data": menus,
    }


@router.put("/show-all-menus")
def update_show_all_menus(
    payload: ShowAllMenuRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    db_user = (
        db.query(User)
        .filter(User.id == current_user["user_id"])
        .first()
    )

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_user.show_all_menus = payload.show_all_menus

    db.commit()
    db.refresh(db_user)

    return {
        "success": True,
        "message": "Show All Menus updated successfully",
        "show_all_menus": db_user.show_all_menus,
    }