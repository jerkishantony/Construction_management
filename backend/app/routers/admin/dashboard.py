from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import admin_required
from app.database.database import get_db
from app.models.user import User

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])


@router.get("/dashboard")
def get_dashboard(
    db: Session = Depends(get_db),
    admin=Depends(admin_required)   # 🔐 ONLY ADMIN CAN PASS
):

    total_users = db.query(User).count()

    active_users = (
        db.query(User)
        .filter(User.is_active == True)
        .count()
        if hasattr(User, "is_active")
        else 0
    )

    return {
        "total_users": total_users,
        "active_users": active_users
    }