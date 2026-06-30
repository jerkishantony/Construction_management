from sqlalchemy import Column, Integer, String, Boolean
from app.database.database import Base

class Menu(Base):
    __tablename__ = "menus"

    id = Column(Integer, primary_key=True, index=True)
    menu_key = Column(String, unique=True, index=True)
    menu_name = Column(String)
    route = Column(String)
    icon = Column(String)
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

