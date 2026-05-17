from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Order

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("/")
def get_orders(limit: int = 20, db: Session = Depends(get_db)):
    return db.query(Order).limit(limit).all()
