from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from app.database.database import get_db
from app.core.deps import admin_required

from app.services.permission.permission_service import (
    get_role_permissions,
    update_permission,
    save_all_permissions
)

from app.models.role_permission import RolePermission

router = APIRouter(
    prefix="/admin/permissions",
    tags=["Admin - Permissions"]
)


# -------------------------
# GET ROLE PERMISSIONS
# -------------------------
@router.get("/{role_id}")
def get_permissions(
    role_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    return get_role_permissions(db, role_id)


# -------------------------
# SINGLE UPDATE SCHEMA
# -------------------------
class PermissionUpdate(BaseModel):
    role_id: int
    menu_id: int
    can_view: bool
    can_create: bool
    can_edit: bool
    can_delete: bool


# -------------------------
# UPDATE SINGLE PERMISSION
# -------------------------
@router.post("/update")
def update_permission_api(
    data: PermissionUpdate,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    return update_permission(db, data)


# -------------------------
# BULK SAVE SCHEMA
# -------------------------
class BulkPermissionUpdate(BaseModel):
    role_id: int
    permissions: List[dict]


# -------------------------
# SAVE ALL PERMISSIONS
# -------------------------
@router.post("/save-all")
def save_all_permissions_api(
    data: BulkPermissionUpdate,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    return save_all_permissions(db, data.role_id, data.permissions)