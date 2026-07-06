from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.admin.menu.role import Role
from app.core.deps import admin_required

router = APIRouter(
    prefix="/admin/roles",
    tags=["Admin - Roles"]
)

# CREATE ROLE
@router.post("/create")
def create_role(
    role_name: str,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):

    exists = db.query(Role).filter(Role.role_name == role_name).first()

    if exists:
        return {"message": "Role already exists"}

    role = Role(role_name=role_name)
    db.add(role)
    db.commit()

    return {"message": "Role created successfully"}


# GET ALL ROLES
@router.get("/")
def get_roles(
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):

    return db.query(Role).all()


# DELETE ROLE
@router.delete("/{role_id}")
def delete_role(
    role_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):

    role = db.query(Role).filter(Role.id == role_id).first()

    if not role:
        return {"message": "Role not found"}

    db.delete(role)
    db.commit()

    return {"message": "Role deleted"}