from itertools import combinations

import pandas as pd
from sqlalchemy.orm import Session


class RecommendationService:
    def __init__(self):
        self.rules_index = {"__max_antecedent_size__": 0}

    def load_rules(
        self,
        db: Session,
        job_name: str = "uci_product",
        algorithm: str = "fp_growth",
    ):

        query = """
        SELECT *
        FROM fact_recommendation_rules
        WHERE job_name = :job_name
        AND algorithm = :algorithm
        """

        rules = pd.read_sql_query(
            query,
            db.bind,
            params={
                "job_name": job_name,
                "algorithm": algorithm,
            },
        )

        self.rules_index = self.compile_rules(rules)

    def compile_rules(self, rules: pd.DataFrame):

        index = {"__max_antecedent_size__": 0}

        if rules.empty:
            return index

        for _, rule in rules.iterrows():
            antecedent = frozenset(str(rule["antecedent"]).split(" | "))

            consequents = set(str(rule["consequent"]).split(" | "))

            index.setdefault(antecedent, []).append(
                {
                    "consequents": consequents,
                    "matched_antecedent": rule["antecedent"],
                    "confidence": float(rule["confidence"]),
                    "lift": float(rule["lift"]),
                    "support": float(rule["support"]),
                    "score": (float(rule["confidence"]) * float(rule["lift"])),
                }
            )

            index["__max_antecedent_size__"] = max(
                index["__max_antecedent_size__"],
                len(antecedent),
            )

        return index

    def recommend(
        self,
        input_items: list[str],
        top_k: int = 5,
    ):

        input_set = set(input_items)

        scores = {}
        evidence = {}

        input_list = sorted(input_set)

        max_size = min(
            self.rules_index.get(
                "__max_antecedent_size__",
                0,
            ),
            len(input_list),
        )

        for size in range(1, max_size + 1):
            for antecedent_tuple in combinations(
                input_list,
                size,
            ):
                antecedent = frozenset(antecedent_tuple)

                for rule in self.rules_index.get(
                    antecedent,
                    [],
                ):
                    for item in rule["consequents"] - input_set:
                        if rule["score"] > scores.get(item, 0):
                            scores[item] = rule["score"]

                            evidence[item] = {
                                "matched_antecedent": (rule["matched_antecedent"]),
                                "confidence": (rule["confidence"]),
                                "lift": rule["lift"],
                                "support": (rule["support"]),
                            }

        ranked = sorted(
            scores.items(),
            key=lambda kv: kv[1],
            reverse=True,
        )[:top_k]

        return [
            {
                "recommended_item": item,
                "score": score,
                **evidence[item],
            }
            for item, score in ranked
        ]
