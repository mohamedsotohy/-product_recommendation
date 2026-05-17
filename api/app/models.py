from sqlalchemy import Column, Float, Integer, String

from .database import Base


class Product(Base):
    __tablename__ = "dim_product"

    product_key = Column(Integer, primary_key=True)
    source_system = Column(String)
    product_source_id = Column(String)
    product_name = Column(String)
    category = Column(String)


class SalesLine(Base):
    __tablename__ = "fact_sales_line"

    sales_line_key = Column(Integer, primary_key=True)
    order_key = Column(Integer)
    product_key = Column(Integer)
    customer_key = Column(Integer)
    quantity = Column(Integer)
    unit_price = Column(Float)
    revenue = Column(Float)


class Order(Base):
    __tablename__ = "dim_order"

    order_key = Column(Integer, primary_key=True)
    transaction_id = Column(String)
    transaction_date = Column(String)


class RecommendationRule(Base):
    __tablename__ = "fact_recommendation_rules"

    rule_key = Column(Integer, primary_key=True)
    source_system = Column(String)
    algorithm = Column(String)
    antecedent = Column(String)
    consequent = Column(String)
    support = Column(Float)
    confidence = Column(Float)
    lift = Column(Float)
