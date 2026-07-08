from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)

    full_name = Column(String(150), nullable=True)
    email = Column(String(150), unique=True, nullable=True)
    phone = Column(String(20), nullable=True)
    company_name = Column(String(150), nullable=True)

    is_active = Column(Boolean, default=True)

    role_id = Column(Integer, ForeignKey("roles.id"))

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    show_all_menus = Column(Boolean, default=False)
    role = relationship("Role")

    subscription = relationship("Subscription",back_populates="user",uselist=False)
