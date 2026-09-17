from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Boolean,
    DateTime,
    ForeignKey,
    Numeric
)

from app.database.database import Base


class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)

    # Client/User who owns this material
    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    # Will be connected to projects later
    project_id = Column(
        Integer,
        nullable=True,
        index=True
    )

    # Material information
    material_name = Column(
        String(150),
        nullable=False
    )

    category = Column(
        String(100),
        nullable=True
    )

    # consumable / tool
    item_type = Column(
        String(30),
        nullable=False,
        default="consumable"
    )

    # Bag / Kg / Ton / Piece / Meter etc.
    unit = Column(
        String(50),
        nullable=False
    )

    # Current available stock
    quantity = Column(
        Numeric(14, 3),
        nullable=False,
        default=0
    )

    # Alert when stock reaches this level
    minimum_stock = Column(
        Numeric(14, 3),
        nullable=False,
        default=0
    )

    description = Column(
        Text,
        nullable=True
    )

    is_active = Column(
        Boolean,
        default=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )