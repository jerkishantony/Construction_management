from pydantic import BaseModel, EmailStr
from typing import Optional


class SystemSettingsCreate(BaseModel):
    company_name: Optional[str] = None
    company_email: Optional[EmailStr] = None
    company_phone: Optional[str] = None

    email_notifications: bool = True
    sms_notifications: bool = True

    language: str = "English"
    timezone: str = "Asia/Kolkata"

    dark_mode: bool = False
    compact_sidebar: bool = False