from sqlalchemy.orm import Session

from app.models.client.material import Material
from app.schemas.client.material import (
    MaterialCreate,
    MaterialUpdate
)


def create_material(
    db: Session,
    user_id: int,
    material_data: MaterialCreate
):
    material = Material(
        user_id=user_id,
        material_name=material_data.material_name,
        category=material_data.category,
        item_type=material_data.item_type,
        unit=material_data.unit,
        quantity=material_data.quantity,
        minimum_stock=material_data.minimum_stock,
        description=material_data.description,
        is_active=True
    )

    db.add(material)
    db.commit()
    db.refresh(material)

    return material


def get_materials(
    db: Session,
    user_id: int
):
    return (
        db.query(Material)
        .filter(Material.user_id == user_id)
        .order_by(Material.id.desc())
        .all()
    )


def get_material(
    db: Session,
    user_id: int,
    material_id: int
):
    return (
        db.query(Material)
        .filter(
            Material.id == material_id,
            Material.user_id == user_id
        )
        .first()
    )


def update_material(
    db: Session,
    material: Material,
    material_data: MaterialUpdate
):
    update_data = material_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(material, field, value)

    db.commit()
    db.refresh(material)

    return material


def delete_material(
    db: Session,
    material: Material
):
    db.delete(material)
    db.commit()

    return True