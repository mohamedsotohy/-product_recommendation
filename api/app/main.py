from fastapi import FastAPI

from app.database import SessionLocal
from app.recommendation import recommender
from app.routers import orders, products, recommendations

app = FastAPI(title="Ecommerce Recommendation API", version="1.0.0")


@app.on_event("startup")
def startup():

    db = SessionLocal()

    try:
        recommender.load_rules(
            db,
            job_name="uci_product",
            algorithm="fp_growth",
        )

    finally:
        db.close()


app.include_router(products.router)
app.include_router(orders.router)
app.include_router(recommendations.router)


@app.get("/")
def root():
    return {"message": "Recommendation API Running"}
