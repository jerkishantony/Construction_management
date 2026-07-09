from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.admin.pages.user import User
from app.models.admin.menu.menu import Menu
from app.models.admin.menu.role_permission import RolePermission


def get_my_menus(db: Session, user_id: int):
    # Get logged-in user
    db_user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Join permissions with menus
    results = (
        db.query(RolePermission, Menu)
        .join(Menu, RolePermission.menu_id == Menu.id)
        .filter(
         RolePermission.user_id == user_id,
         RolePermission.can_view == True,
         Menu.is_active == True
         )
        .order_by(Menu.display_order)
        .all()
    )

    menus = []

    for permission, menu in results:
        menus.append({
            "id": menu.id,
            "menu_id": menu.id,
            "menu_name": menu.menu_name,
            "menu_key": menu.menu_key,
            "route": menu.route,
            "display_order": menu.display_order,
            "icon": menu.icon,
            "is_active": menu.is_active,

            "can_view": permission.can_view,
            "can_create": permission.can_create,
            "can_edit": permission.can_edit,
            "can_delete": permission.can_delete,
        })

    return {
        "success": True,
        "message": "User menus fetched successfully",
        "data": menus,
    }