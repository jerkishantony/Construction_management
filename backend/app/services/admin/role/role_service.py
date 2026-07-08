from sqlalchemy.orm import Session
from app.models.admin.menu.role import Role

def get_roles(db: Session):
    roles = db.query(Role).order_by(Role.id).all()

    return {
        "success": True,
        "data": [
            {
                "id": role.id,
                "role_name": role.role_name
            }
            for role in roles
        ]
    }