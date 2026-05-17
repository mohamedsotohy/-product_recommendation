from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Product

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/")
def get_products(limit: int = 20, db: Session = Depends(get_db)):
    return db.query(Product).limit(limit).all()


@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    return db.query(Product).filter(Product.product_key == product_id).first()
