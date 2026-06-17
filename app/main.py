from fastapi import FastAPI
from app.database.database import Base, engine, SessionLocal
from app.models.user import User
from app.core.security import hash_password

from app.routers.auth import router as auth_router
from app.routers.admin.users import router as admin_user_router

app = FastAPI()

Base.metadata.create_all(bind=engine)

# -----------------------------
# AUTO ADMIN (ON STARTUP)
# -----------------------------
@app.on_event("startup")
def create_default_admin():
    db = SessionLocal()

    admin = db.query(User).filter(User.role == "admin").first()

    if not admin:
        new_admin = User(
            username="admin",
            password=hash_password("admin123"),
            role="admin"
        )

        db.add(new_admin)
        db.commit()
        print("🔥 Default admin created -> admin / admin123")

    db.close()


# -----------------------------
# ROUTERS
# -----------------------------
app.include_router(auth_router)
app.include_router(admin_user_router)


# -----------------------------
# HOME
# -----------------------------
@app.get("/")
def home():
    return {"message": "Construction API Running 🚀"}