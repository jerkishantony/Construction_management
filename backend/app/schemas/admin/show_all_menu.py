from pydantic import BaseModel

class ShowAllMenuRequest(BaseModel):
    show_all_menus: bool