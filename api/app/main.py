from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import SessionLocal
from app.recommendation import recommender
from app.routers import orders, products, recommendations

app = FastAPI(title="Ecommerce Recommendation API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():

    db = SessionLocal()
    try:
        recommender.load_rules()
    finally:
        db.close()


app.include_router(products.router)
app.include_router(orders.router)
app.include_router(recommendations.router)


@app.get("/")
def root():
    return {"message": "Recommendation API Running"}
