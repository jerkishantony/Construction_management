from fastapi import Depends, HTTPException
from app.core.auth_bearer import get_current_user

def admin_required(user=Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only access")
    return user