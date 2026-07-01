from fastapi import Depends, HTTPException
from app.core.auth_bearer import get_current_user

def admin_required(user=Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    # BEST (RBAC way)
    if user.get("role_id") != 1:
        raise HTTPException(status_code=403, detail="Admin only access")

    return user

def role_required(required_role_id: int):
    def wrapper(user=Depends(get_current_user)):
        if user.get("role_id") != required_role_id:
            raise HTTPException(status_code=403, detail="Access denied")
        return user
    return wrapper