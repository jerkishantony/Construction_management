from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.admin.menu.menu import Menu
from app.core.deps import get_current_user  # IMPORTANT CHANGE
from app.services.admin.menu.menu_service import get_menus_by_role
router = APIRouter(
    prefix="/admin/menus",
    tags=["Admin - Menus"]
)

@router.get("/")
def get_menus(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    print(user)
    # menus = get_menus_by_role(db, user["role_id"])
    menus = get_menus_by_role(
    db=db,
    role_id=user["role_id"],
    role_name=user["role"],
    show_all_menus=user.get("show_all_menus", False)
)

    return {
        "success": True,
        "message": "Menus fetched successfully",
        "data": menus
    }