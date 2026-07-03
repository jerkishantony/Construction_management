from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.database.database import Base


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    plan = Column(String)   # basic / pro / premium

    start_date = Column(Date)
    end_date = Column(Date)

    is_active = Column(Boolean, default=True)

    # Relationship
    user = relationship("User", back_populates="subscription")