from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta

# Secret settings
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ----------------------
# HASH PASSWORD
# ----------------------
def hash_password(password: str):
    return pwd_context.hash(password)


# ----------------------
# VERIFY PASSWORD
# ----------------------
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


# ----------------------
# CREATE JWT TOKEN
# ----------------------
def create_access_token(data: dict, expires_minutes: int = 60):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt