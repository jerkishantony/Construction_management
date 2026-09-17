from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class MaterialCreate(BaseModel):
    material_name: str = Field(..., min_length=1, max_length=150)
    category: Optional[str] = None

    item_type: str = Field(
        default="consumable",
        pattern="^(consumable|tool)$"
    )

    unit: str = Field(..., min_length=1, max_length=50)

    quantity: Decimal = Field(
        default=Decimal("0"),
        ge=0
    )

    minimum_stock: Decimal = Field(
        default=Decimal("0"),
        ge=0
    )

    description: Optional[str] = None


class MaterialUpdate(BaseModel):
    material_name: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=150
    )

    category: Optional[str] = None

    item_type: Optional[str] = Field(
        default=None,
        pattern="^(consumable|tool)$"
    )

    unit: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=50
    )

    quantity: Optional[Decimal] = Field(
        default=None,
        ge=0
    )

    minimum_stock: Optional[Decimal] = Field(
        default=None,
        ge=0
    )

    description: Optional[str] = None

    is_active: Optional[bool] = None


class MaterialResponse(BaseModel):
    id: int
    user_id: int
    project_id: Optional[int] = None

    material_name: str
    category: Optional[str] = None
    item_type: str
    unit: str

    quantity: Decimal
    minimum_stock: Decimal

    description: Optional[str] = None
    is_active: bool

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)