from pydantic import BaseModel


class PermissionCreate(BaseModel):
    user_id: int
    menu_id: int

    can_view: bool = False
    can_add: bool = False
    can_edit: bool = False
    can_delete: bool = False


class PermissionResponse(PermissionCreate):
    id: int

    class Config:
        from_attributes = True