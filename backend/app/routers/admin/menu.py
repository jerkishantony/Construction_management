from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.menu import Menu
from app.core.deps import get_current_user  # IMPORTANT CHANGE
from app.services.menu.menu_service import get_menus_by_role
router = APIRouter(
    prefix="/admin/menus",
    tags=["Admin - Menus"]
)

@router.get("/")
def get_menus(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    menus = get_menus_by_role(db, user["role_id"])

    return {
        "success": True,
        "message": "Menus fetched successfully",
        "data": menus
    }