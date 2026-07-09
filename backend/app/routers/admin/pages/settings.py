# app/routers/admin/settings.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.core.auth_bearer import get_current_user

from app.models.admin.pages.settings import SystemSettings
from app.schemas.admin.settings import SystemSettingsCreate

router = APIRouter(
    prefix="/settings",
    tags=["Admin Settings"]
)


# ---------------------------------
# GET SETTINGS
# ---------------------------------
@router.get("/")
def get_settings(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    settings = (
        db.query(SystemSettings)
        .filter(SystemSettings.user_id == current_user["user_id"])
        .first()
    )

    # Auto-create a default row instead of 404'ing, so a first-time
    # visit to the Settings page doesn't error out.
    if not settings:
        settings = SystemSettings(user_id=current_user["user_id"])
        db.add(settings)
        db.commit()
        db.refresh(settings)

    return {
        "email_notifications": settings.email_notifications,
        "sms_notifications": settings.sms_notifications,
        "language": settings.language,
        "timezone": settings.timezone,
        "dark_mode": settings.dark_mode,
        "compact_sidebar": settings.compact_sidebar,

        "created_at": settings.created_at,
        "updated_at": settings.updated_at,
    }


# ---------------------------------
# UPDATE SETTINGS
# ---------------------------------
@router.put("/")
def update_settings(
    data: SystemSettingsCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    settings = (
        db.query(SystemSettings)
        .filter(SystemSettings.user_id == current_user["user_id"])
        .first()
    )

    if not settings:
        settings = SystemSettings(user_id=current_user["user_id"])
        db.add(settings)

    settings.email_notifications = data.email_notifications
    settings.sms_notifications = data.sms_notifications
    settings.language = data.language
    settings.timezone = data.timezone
    settings.dark_mode = data.dark_mode
    settings.compact_sidebar = data.compact_sidebar

    db.commit()
    db.refresh(settings)

    return {
        "success": True,
        "message": "Settings updated successfully",
        "settings": {
            "email_notifications": settings.email_notifications,
            "sms_notifications": settings.sms_notifications,
            "language": settings.language,
            "timezone": settings.timezone,
            "dark_mode": settings.dark_mode,
            "compact_sidebar": settings.compact_sidebar,
        },
    }