from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.admin.settings import SystemSettingsCreate
from app.database.database import get_db
from app.core.auth_bearer import get_current_user
from app.models.admin.pages.subscription import Subscription

router = APIRouter(prefix="/settings",tags=["Admin Settings"])


@router.get("/")
def get_settings(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    settings = (
        db.query(Subscription)
        .filter(Subscription.user_id == current_user["user_id"])
        .first()
    )

    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found")

    return {
        "company_name": settings.company_name,
        "company_email": settings.company_email,
        "company_phone": settings.company_phone,
        "email_notifications": settings.email_notifications,
        "sms_notifications": settings.sms_notifications,
        "language": settings.language,
        "timezone": settings.timezone,
        "dark_mode": settings.dark_mode,
        "compact_sidebar": settings.compact_sidebar,
        "created_at": settings.created_at,
        "updated_at": settings.updated_at,
    }
@router.put("/")
def update_settings(
    data: SystemSettingsCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    settings = (
        db.query(Subscription)
        .filter(Subscription.user_id == current_user["user_id"])
        .first()
    )

    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found")

    settings.company_name = data.company_name
    settings.company_email = data.company_email
    settings.company_phone = data.company_phone
    settings.email_notifications = data.email_notifications
    settings.sms_notifications = data.sms_notifications
    settings.language = data.language
    settings.timezone = data.timezone
    settings.dark_mode = data.dark_mode
    settings.compact_sidebar = data.compact_sidebar

    db.commit()
    db.refresh(settings)

    return {
        "message": "Settings updated successfully",
        "data": settings
    }