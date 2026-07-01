from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)

    role_id = Column(Integer, ForeignKey("roles.id"))  # ONLY THIS (REMOVE OLD role string)

    is_active = Column(Boolean, default=True)

    role = relationship("Role")