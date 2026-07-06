from sqlalchemy.orm import Session
from app.models.admin.menu import Role, Menu, RolePermission

def seed_admin_permissions(db: Session):
    admin = db.query(Role).filter(Role.role_name == "Admin").first()
    menus = db.query(Menu).all()

    if not admin:
        return

    for menu in menus:
        exists = db.query(RolePermission).filter_by(
            role_id=admin.id,
            menu_id=menu.id
        ).first()

        if not exists:
            db.add(RolePermission(
                role_id=admin.id,
                menu_id=menu.id,
                can_view=True,
                can_create=True,
                can_edit=True,
                can_delete=True
            ))

    db.commit()