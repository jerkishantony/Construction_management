from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from sqlalchemy.orm import Session

from app.database.database import get_db
from app.core.auth_bearer import get_current_user

from app.schemas.client.material import (
    MaterialCreate,
    MaterialUpdate,
    MaterialResponse
)

from app.services.client.material_service import (
    create_material,
    get_materials,
    get_material,
    update_material,
    delete_material
)


router = APIRouter(
    prefix="/client/materials",
    tags=["Client Materials"]
)


def get_user_id(current_user: dict):
    user_id = current_user.get("user_id")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user information"
        )

    return user_id


@router.post(
    "",
    response_model=MaterialResponse,
    status_code=status.HTTP_201_CREATED
)
def add_material(
    material_data: MaterialCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = get_user_id(current_user)

    return create_material(
        db=db,
        user_id=user_id,
        material_data=material_data
    )


@router.get(
    "",
    response_model=list[MaterialResponse]
)
def list_materials(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = get_user_id(current_user)

    return get_materials(
        db=db,
        user_id=user_id
    )


@router.get(
    "/{material_id}",
    response_model=MaterialResponse
)
def get_single_material(
    material_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = get_user_id(current_user)

    material = get_material(
        db=db,
        user_id=user_id,
        material_id=material_id
    )

    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found"
        )

    return material


@router.put(
    "/{material_id}",
    response_model=MaterialResponse
)
def edit_material(
    material_id: int,
    material_data: MaterialUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = get_user_id(current_user)

    material = get_material(
        db=db,
        user_id=user_id,
        material_id=material_id
    )

    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found"
        )

    return update_material(
        db=db,
        material=material,
        material_data=material_data
    )


@router.delete(
    "/{material_id}"
)
def remove_material(
    material_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = get_user_id(current_user)

    material = get_material(
        db=db,
        user_id=user_id,
        material_id=material_id
    )

    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found"
        )

    delete_material(
        db=db,
        material=material
    )

    return {
        "message": "Material deleted successfully"
    }