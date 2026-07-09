from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base


class SystemSettings(Base):
    __tablename__ = "system_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)

    email_notifications = Column(Boolean, default=True)
    sms_notifications = Column(Boolean, default=True)

    language = Column(String(10), default="en")
    timezone = Column(String(100), default="Asia/Kolkata")

    dark_mode = Column(Boolean, default=False)
    compact_sidebar = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)