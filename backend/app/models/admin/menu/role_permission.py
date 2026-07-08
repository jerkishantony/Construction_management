from sqlalchemy import Column, Integer, ForeignKey, Boolean
from app.database.database import Base


class RolePermission(Base):
    __tablename__ = "role_permissions"

    id = Column(Integer, primary_key=True, index=True)

    role_id = Column(Integer, ForeignKey("roles.id"))
    user_id = Column(Integer, ForeignKey("users.id"))   # <-- ADD THIS

    menu_id = Column(Integer, ForeignKey("menus.id"))

    can_view = Column(Boolean, default=False)
    can_create = Column(Boolean, default=False)
    can_edit = Column(Boolean, default=False)
    can_delete = Column(Boolean, default=False)