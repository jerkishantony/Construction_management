from app.database import SessionLocal
from app.seeders.permissions_seed import seed_admin_permissions

db = SessionLocal()
seed_admin_permissions(db)

print("Done")