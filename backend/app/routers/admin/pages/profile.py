from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.core.auth_bearer import get_current_user

from app.models.admin.pages.user import User
from app.models.admin.menu.role import Role
from app.models.admin.pages.subscription import Subscription

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


@router.get("/")
def get_profile(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = (
        db.query(User, Role, Subscription)
        .join(Role, User.role_id == Role.id)
        .outerjoin(Subscription, User.id == Subscription.user_id)
        .filter(User.id == current_user["user_id"])
        .first()
    )

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user, role, subscription = user

    return {
        "id": user.id,
        "username": user.username,
        "full_name": user.full_name,
        "email": user.email,
        "phone": user.phone,
        "company_name": user.company_name,
        "role": role.role_name,
        "plan": subscription.plan if subscription else None,
        "subscription_start": subscription.start_date if subscription else None,
        "subscription_end": subscription.end_date if subscription else None,
        "is_active": user.is_active,
        "created_at": user.created_at,
    }