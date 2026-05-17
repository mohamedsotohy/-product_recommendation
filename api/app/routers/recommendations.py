from fastapi import APIRouter

from app.recommendation import recommender
from app.schemas import (
    RecommendationRequest,
    RecommendationResponse,
)

router = APIRouter(
    prefix="/recommendations",
    tags=["recommendations"],
)


@router.post(
    "/",
    response_model=RecommendationResponse,
)
def recommend_products(
    request: RecommendationRequest,
):

    recommendations = recommender.recommend(
        input_items=request.cart_products,
        top_k=request.top_k,
    )

    return {"recommendations": recommendations}
