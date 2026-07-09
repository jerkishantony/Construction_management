from sqlalchemy.orm import Session

from app.models.admin.menu.menu import Menu
from app.models.admin.menu.role_permission import RolePermission
from app.models.admin.pages.user import User
from app.services.admin.menu.menu_service import ADMIN_DEFAULT_MENU_KEYS


# -------------------------
# GET USER PERMISSIONS
# -------------------------
def get_user_permissions(db: Session, user_id: int):

    menus = (
    db.query(Menu)
    .filter(~Menu.menu_key.in_(ADMIN_DEFAULT_MENU_KEYS))
    .order_by(Menu.display_order)
    .all()
)

    result = []

    for menu in menus:
        perm = (
            db.query(RolePermission)
            .filter(
                RolePermission.user_id == user_id,
                RolePermission.menu_id == menu.id
            )
            .first()
        )

        result.append({
            "menu_id": menu.id,
            "menu_name": menu.menu_name,
            "menu_key": menu.menu_key,
            "can_view": perm.can_view if perm else False,
            "can_create": perm.can_create if perm else False,
            "can_edit": perm.can_edit if perm else False,
            "can_delete": perm.can_delete if perm else False,
        })

    return result


# -------------------------
# UPDATE SINGLE PERMISSION
# -------------------------
def update_permission(db: Session, data):

    perm = (
        db.query(RolePermission)
        .filter(
            RolePermission.user_id == data.user_id,
            RolePermission.menu_id == data.menu_id
        )
        .first()
    )

    if not perm:
        perm = RolePermission(
            role_id=data.role_id,
            user_id=data.user_id,
            menu_id=data.menu_id,
        )
        db.add(perm)

    perm.can_view = data.can_view
    perm.can_create = data.can_create
    perm.can_edit = data.can_edit
    perm.can_delete = data.can_delete

    db.commit()

    return {"message": "Permission updated successfully"}


# -------------------------
# SAVE ALL PERMISSIONS
# -------------------------
def save_all_permissions(db: Session, user_id: int, permissions):

    db.query(RolePermission).filter(
        RolePermission.user_id == user_id
    ).delete()

    for p in permissions:
        user = db.query(User).filter(User.id == user_id).first()
        db.add(
            RolePermission(
                user_id=user_id,
                role_id=user.role_id,  # temporary (or fetch from users table)
                menu_id=p["menu_id"],
                can_view=p.get("can_view", False),
                can_create=p.get("can_create", False),
                can_edit=p.get("can_edit", False),
                can_delete=p.get("can_delete", False),
            )
        )

    db.commit()

    return {"message": "Permissions saved successfully"}