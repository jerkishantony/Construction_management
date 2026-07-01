from sqlalchemy.orm import Session
from app.models.menu import Menu
from app.models.role_permission import RolePermission


# -------------------------
# GET ROLE PERMISSIONS
# -------------------------
def get_role_permissions(db: Session, role_id: int):

    menus = db.query(Menu).order_by(Menu.display_order).all()

    result = []

    for menu in menus:
        perm = db.query(RolePermission).filter_by(
            role_id=role_id,
            menu_id=menu.id
        ).first()

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

    perm = db.query(RolePermission).filter_by(
        role_id=data.role_id,
        menu_id=data.menu_id
    ).first()

    if not perm:
        perm = RolePermission(
            role_id=data.role_id,
            menu_id=data.menu_id
        )
        db.add(perm)

    perm.can_view = data.can_view
    perm.can_create = data.can_create
    perm.can_edit = data.can_edit
    perm.can_delete = data.can_delete

    db.commit()

    return {"message": "Permission updated successfully"}


# -------------------------
# BULK SAVE PERMISSIONS
# -------------------------
def save_all_permissions(db: Session, role_id: int, permissions: list):

    db.query(RolePermission).filter(
        RolePermission.role_id == role_id
    ).delete()

    for p in permissions:
        db.add(RolePermission(
            role_id=role_id,
            menu_id=p["menu_id"],
            can_view=p.get("can_view", False),
            can_create=p.get("can_create", False),
            can_edit=p.get("can_edit", False),
            can_delete=p.get("can_delete", False),
        ))

    db.commit()

    return {"message": "All permissions saved successfully"}