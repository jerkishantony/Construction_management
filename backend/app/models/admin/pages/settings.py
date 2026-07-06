from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base


class SystemSettings(Base):
    __tablename__ = "system_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    company_name = Column(String)
    company_email = Column(String)
    company_phone = Column(String)

    email_notifications = Column(Boolean, default=True)
    sms_notifications = Column(Boolean, default=True)

    language = Column(String)
    timezone = Column(String)

    dark_mode = Column(Boolean, default=False)
    compact_sidebar = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # user = relationship("User", back_populates="system_settings")