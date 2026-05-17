from typing import List

from pydantic import BaseModel


class RecommendationRequest(BaseModel):
    cart_products: List[str]
    top_k: int = 5


class RecommendationItem(BaseModel):
    recommended_item: str
    score: float
    matched_antecedent: str
    confidence: float
    lift: float
    support: float


class RecommendationResponse(BaseModel):
    recommendations: List[RecommendationItem]
