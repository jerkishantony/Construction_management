from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from app.database.database import get_db
from app.core.deps import admin_required

from app.services.admin.permission.permission_service import (
    get_user_permissions,
    update_permission,
    save_all_permissions
)

router = APIRouter(
    prefix="/admin/permissions",
    tags=["Admin - Permissions"]
)


# -------------------------
# GET USER PERMISSIONS
# -------------------------
@router.get("/{user_id}")
def get_permissions(
    user_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    return get_user_permissions(db, user_id)


# -------------------------
# UPDATE ONE
# -------------------------
class PermissionUpdate(BaseModel):
    role_id: int
    user_id: int
    menu_id: int
    can_view: bool
    can_create: bool
    can_edit: bool
    can_delete: bool


@router.post("/update")
def update_permission_api(
    data: PermissionUpdate,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    return update_permission(db, data)


# -------------------------
# SAVE ALL
# -------------------------
class BulkPermissionUpdate(BaseModel):
    user_id: int
    permissions: List[dict]


@router.post("/save-all")
def save_all_permissions_api(
    data: BulkPermissionUpdate,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    return save_all_permissions(
        db,
        data.user_id,
        data.permissions,
    )