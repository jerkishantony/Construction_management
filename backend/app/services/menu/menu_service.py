from sqlalchemy.orm import Session
from app.models.menu import Menu
from app.models.role_permission import RolePermission
from app.models.role import Role

def get_menus_by_role(db: Session, role_id: int):
    menus = db.query(Menu).order_by(Menu.display_order).all()

    result = []

    for menu in menus:
        perm = db.query(RolePermission).filter_by(
            role_id=role_id,
            menu_id=menu.id
        ).first()

        if perm and perm.can_view:
            result.append(menu)

    return result


def create_default_menus(db: Session):
    default_menus = [
        {"menu_key": "dashboard", "menu_name": "Dashboard", "route": "/dashboard", "icon": "dashboard", "display_order": 1},
        {"menu_key": "users", "menu_name": "User Management", "route": "/users", "icon": "users", "display_order": 2},
        {"menu_key": "menus", "menu_name": "Menu Management", "route": "/menus", "icon": "menu", "display_order": 3},
        {"menu_key": "permissions", "menu_name": "Permission Management", "route": "/permissions", "icon": "lock", "display_order": 4},
        {"menu_key": "company", "menu_name": "Company", "route": "/company", "icon": "business", "display_order": 5},
        {"menu_key": "projects", "menu_name": "Projects", "route": "/projects", "icon": "folder", "display_order": 6},
        {"menu_key": "workers", "menu_name": "Workers", "route": "/workers", "icon": "people", "display_order": 7},
        {"menu_key": "attendance", "menu_name": "Attendance", "route": "/attendance", "icon": "calendar", "display_order": 8},
        {"menu_key": "payroll", "menu_name": "Payroll", "route": "/payroll", "icon": "payments", "display_order": 9},
        {"menu_key": "materials", "menu_name": "Materials", "route": "/materials", "icon": "inventory", "display_order": 10},
        {"menu_key": "suppliers", "menu_name": "Suppliers", "route": "/suppliers", "icon": "local_shipping", "display_order": 11},
        {"menu_key": "expenses", "menu_name": "Expenses", "route": "/expenses", "icon": "receipt", "display_order": 12},
        {"menu_key": "reports", "menu_name": "Reports", "route": "/reports", "icon": "assessment", "display_order": 13},
        {"menu_key": "settings", "menu_name": "Settings", "route": "/settings", "icon": "settings", "display_order": 14}
    ]

    for menu in default_menus:
        exists = db.query(Menu).filter_by(menu_key=menu["menu_key"]).first()
        if not exists:
            db.add(Menu(**menu))

    db.commit()

    

def create_default_permissions(db: Session):
    admin_role = db.query(Role).filter_by(role_name="admin").first()
    user_role = db.query(Role).filter_by(role_name="user").first()

    all_menus = db.query(Menu).all()

    # Menus a normal "user" role should see by default.
    # Adjust this list to whatever makes sense for your app.
    user_default_menu_keys = {"dashboard", "projects", "attendance", "materials"}

    for menu in all_menus:
        # --- Admin: full access to everything ---
        if admin_role:
            perm = db.query(RolePermission).filter_by(
                role_id=admin_role.id, menu_id=menu.id
            ).first()
            if not perm:
                db.add(RolePermission(
                    role_id=admin_role.id,
                    menu_id=menu.id,
                    can_view=True,
                    can_create=True,
                    can_edit=True,
                    can_delete=True
                ))

        # --- User: view-only on a default subset of menus ---
        if user_role:
            perm = db.query(RolePermission).filter_by(
                role_id=user_role.id, menu_id=menu.id
            ).first()
            if not perm:
                is_default_visible = menu.menu_key in user_default_menu_keys
                db.add(RolePermission(
                    role_id=user_role.id,
                    menu_id=menu.id,
                    can_view=is_default_visible,
                    can_create=False,
                    can_edit=False,
                    can_delete=False
                ))

    db.commit()