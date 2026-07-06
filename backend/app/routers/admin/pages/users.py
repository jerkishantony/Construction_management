from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.admin.pages.user import User
from app.models.admin.menu.role import Role
from app.models.admin.pages.subscription import Subscription
from app.schemas.admin.user import UserCreate, UserUpdate, UserStatusUpdate
from app.core.security import hash_password
from app.core.deps import admin_required
from datetime import date, timedelta

router = APIRouter(
    prefix="/admin/users",
    tags=["Admin - Users"]
)

# PLAN CONFIG (GLOBAL - OUTSIDE FUNCTION)
PLAN_DURATIONS = {
    "basic": 30,
    "pro": 90,
    "premium": 365
}


# CREATE USER
@router.post("/create")
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    # 1. Get role
    role = db.query(Role).filter(Role.role_name == user.role).first()
    if not role:
        raise HTTPException(status_code=400, detail="Invalid role")

    # Duplicate username
    existing_username = (
        db.query(User)
        .filter(User.username == user.username)
        .first()
    )

    if existing_username:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    # Duplicate email
    existing_email = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    # 2. Create user
    new_user = User(
        username=user.username,
        password=hash_password(user.password),
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        company_name=user.company_name,
        role_id=role.id,
        is_active=True,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 3. Subscription logic (AUTO CREATE)
    plan = user.plan.lower()

    duration_days = PLAN_DURATIONS.get(plan)
    if not duration_days:
        raise HTTPException(status_code=400, detail="Invalid plan selected")

    start_date = date.today()
    end_date = start_date + timedelta(days=duration_days)

    subscription = Subscription(
        user_id=new_user.id,
        plan=plan,
        start_date=start_date,
        end_date=end_date,
        is_active=True
    )

    db.add(subscription)
    db.commit()

    return {
        "message": "User created successfully with subscription",
        "user_id": new_user.id,
        "subscription": {
            "plan": plan,
            "start_date": start_date,
            "end_date": end_date
        }
    }


# ASSIGN ROLE TO USER
@router.post("/assign-role")
def assign_role(
    user_id: int,
    role_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.role_id = role_id
    db.commit()

    return {"message": "Role assigned successfully"}


# GET ALL USERS (ADMIN VIEW)
@router.get("/")
def get_users(
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    users = (
        db.query(User, Role, Subscription)
        .join(Role, User.role_id == Role.id)
        .outerjoin(Subscription, User.id == Subscription.user_id)
        .all()
    )

    return [
        {
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
        for user, role, subscription in users
    ]


# GET SINGLE USER
@router.get("/{user_id}")
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    result = (
        db.query(User, Role, Subscription)
        .join(Role, User.role_id == Role.id)
        .outerjoin(Subscription, User.id == Subscription.user_id)
        .filter(User.id == user_id)
        .first()
    )

    if not result:
        raise HTTPException(status_code=404, detail="User not found")

    user, role, subscription = result

    return {
        "id": user.id,
        "username": user.username,
        "full_name": user.full_name,
        "email": user.email,
        "phone": user.phone,
        "company_name": user.company_name,
        "role": role.role_name,
        "plan": subscription.plan if subscription else None,
        "is_active": user.is_active,
    }


# UPDATE USER
@router.put("/{user_id}")
def update_user(
    user_id: int,
    data: UserUpdate,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    role = db.query(Role).filter(Role.role_name == data.role).first()

    if not role:
        raise HTTPException(status_code=400, detail="Invalid role")

    # Check duplicate username
    username_exists = (
        db.query(User)
        .filter(
            User.username == data.username,
            User.id != user_id
        )
        .first()
    )

    if username_exists:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    # Check duplicate email
    email_exists = (
        db.query(User)
        .filter(
            User.email == data.email,
            User.id != user_id
        )
        .first()
    )

    if email_exists:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    user.username = data.username
    user.full_name = data.full_name
    user.email = data.email
    user.phone = data.phone
    user.company_name = data.company_name
    user.role_id = role.id
    user.is_active = data.is_active

    subscription = (
        db.query(Subscription)
        .filter(Subscription.user_id == user.id)
        .first()
    )

    if subscription:
        plan = data.plan.lower()

        duration = PLAN_DURATIONS.get(plan)

        if not duration:
            raise HTTPException(status_code=400, detail="Invalid plan")

        subscription.plan = plan
        subscription.start_date = date.today()
        subscription.end_date = date.today() + timedelta(days=duration)

    db.commit()

    return {
        "message": "User updated successfully"
    }


# CHANGE STATUS
@router.patch("/{user_id}/status")
def change_status(
    user_id: int,
    status: UserStatusUpdate,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_active = status.is_active

    db.commit()

    return {
        "message": "User status updated successfully"
    }


# DELETE USER
@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.username.lower() == "admin":
        raise HTTPException(
            status_code=400,
            detail="Default admin cannot be deleted"
        )

    subscription = (
        db.query(Subscription)
        .filter(Subscription.user_id == user.id)
        .first()
    )

    if subscription:
        db.delete(subscription)

    db.delete(user)

    db.commit()

    return {
        "message": "User deleted successfully"
    }