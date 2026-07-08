from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.models.admin.pages.subscription import Subscription
from app.database.database import SessionLocal, Base, engine
from app.models.admin.pages.user import User
from app.models.admin.menu.menu import Menu
from app.models.admin.menu.role import Role
from app.models.admin.menu.role_permission import RolePermission
from app.core.security import hash_password
from app.services.admin.menu.menu_service import create_default_menus
from app.routers.admin.authrz.auth import router as auth_router
from app.routers.admin.pages.users import router as admin_user_router
from sqlalchemy import text
from sqlalchemy import inspect
from app.routers.admin.authrz.auth import router as auth_router
from app.routers.admin.pages.users import router as admin_user_router
from app.routers.admin.authrz.menu import router as admin_menu_router
from app.routers.admin.authrz.permissions import router as admin_permission_router
from app.services.admin.menu.menu_service import create_default_menus, create_default_permissions
from app.routers.admin.pages.dashboard import router as dashboard_router
from app.routers.admin.pages import profile
from app.routers.admin.pages.settings import router as settings_router
from app.models.admin.pages.subscription import Subscription
from app.models.admin.pages.settings import SystemSettings
from app.routers.admin.authrz import roles
inspector = inspect(engine)
# print("Tables in DB:", inspector.get_table_names())
# with engine.connect() as conn:
#     result = conn.execute(text("""
#         SELECT current_database(),
#                current_schema(),
#                inet_server_addr(),
#                inet_server_port();
#     """)).fetchone()

#     print(result)
print(Base.metadata.tables.keys())
# Create all tables
Base.metadata.create_all(bind=engine)
@asynccontextmanager
async def lifespan(app: FastAPI):
    db = SessionLocal()

    # STEP 1: ROLES — seed both admin and user roles
    default_roles = ["admin", "user"]
    role_objects = {}

    for role_name in default_roles:
        role = db.query(Role).filter_by(role_name=role_name).first()
        if not role:
            role = Role(role_name=role_name)
            db.add(role)
            db.commit()
            db.refresh(role)
        role_objects[role_name] = role

    admin_role = role_objects["admin"]

    # STEP 2: USER
    admin = db.query(User).filter_by(username="admin").first()

    if not admin:
        admin = User(
            username="admin",
            password=hash_password("admin123"),
            role_id=admin_role.id,
            is_active=True
        )
        db.add(admin)
        db.commit()

    # STEP 3: MENUS
    create_default_menus(db)
    create_default_permissions(db)
    db.close()
    yield

app = FastAPI(lifespan=lifespan)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router)
app.include_router(admin_user_router)
app.include_router(admin_menu_router)
app.include_router(admin_permission_router)
app.include_router(dashboard_router)
app.include_router(profile.router)
app.include_router(settings_router)
app.include_router(roles.router)

@app.get("/")
def home():
    return {"message": "API Running 🚀"}