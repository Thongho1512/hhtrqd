import numpy as np
from typing import List, Dict, Any

# Random Index (RI) table for n=1 to 10 criteria
RI_TABLE = {1: 0, 2: 0, 3: 0.58, 4: 0.90, 5: 1.12, 
            6: 1.24, 7: 1.32, 8: 1.41, 9: 1.45, 10: 1.49}

class AHPService:
    def compute_ahp_criteria(self, matrix: List[List[float]]) -> Dict[str, Any]:
        """
        Computes AHP weights, Lambda Max, CI, and CR from a pairwise comparison matrix.
        Input: NxN matrix (list of lists)
        """
        n = len(matrix)
        M = np.array(matrix, dtype=float)

        # 1. Column sums
        col_sums = M.sum(axis=0)

        # 2. Normalize and compute Priority Vector (Weights)
        normalized = M / col_sums
        weights = normalized.mean(axis=1)

        # 3. Consistency calculation
        # Ax = lambda * x
        weighted_sum = np.dot(M, weights)
        consistency_vector = weighted_sum / weights
        lambda_max = float(np.mean(consistency_vector))

        ci = (lambda_max - n) / (n - 1) if n > 1 else 0
        ri = RI_TABLE.get(n, 1.49)
        cr = ci / ri if ri > 0 else 0

        return {
            "matrix": M.tolist(),
            "col_sums": col_sums.tolist(),
            "normalized_matrix": normalized.tolist(),
            "weights": weights.tolist(),
            "weighted_sum_values": weighted_sum.tolist(),
            "consistency_vector": consistency_vector.tolist(),
            "lambda_max": lambda_max,
            "ci": ci,
            "ri": ri,
            "cr": cr,
            "is_consistent": cr < 0.10
        }

    def compute_ahp_alternatives(
        self,
        criteria_weights: List[float],
        alternatives_matrices: Dict[str, List[List[float]]]
    ) -> Dict[str, Any]:
        """
        Computes the final ranking by combining criteria weights with alternative scores.
        Input:
            criteria_weights: List of weights for the 6 criteria [AI, Thu nhập, Hiệu suất, Hài lòng, Cân bằng, Cấp bậc]
            alternatives_matrices: Dict of 6 matrices (one for each criterion)
        """
        # Criteria names in order
        criteria_keys = ["ai_result", "thu_nhap", "hieu_suat", "hai_long", "can_bang", "cap_bac"]
        
        results_per_criterion = {}
        all_pa_weights = []  # Shape: [n_criteria, n_alternatives]
        
        for key in criteria_keys:
            if key not in alternatives_matrices:
                raise ValueError(f"Missing matrix for criterion: {key}")
            
            res = self.compute_ahp_criteria(alternatives_matrices[key])
            results_per_criterion[key] = res
            all_pa_weights.append(res["weights"])
            
        # pa_weights_matrix: [n_alternatives x n_criteria]
        pa_weights_matrix = np.array(all_pa_weights).T
        criteria_w = np.array(criteria_weights)
        
        # final_scores = matrix calculation
        final_scores = np.dot(pa_weights_matrix, criteria_w)
        
        # ranking: argsort descending
        # np.argsort returns indices that would sort an array. [::-1] reverses it.
        # We'll return 1-based ranks.
        rank_indices = np.argsort(-final_scores)
        ranks = [0] * len(final_scores)
        for i, idx in enumerate(rank_indices):
            ranks[idx] = i + 1

        return {
            "criteria_weights": criteria_weights,
            "results_per_criterion": results_per_criterion,
            "pa_weights_matrix": pa_weights_matrix.tolist(),
            "final_scores": final_scores.tolist(),
            "ranking": ranks,
            "best_alternative_index": int(np.argmax(final_scores)),
            "summary_table": [
                {
                    "pa_index": i,
                    "scores_per_criterion": pa_weights_matrix[i].tolist(),
                    "total_score": float(final_scores[i]),
                    "rank": int(ranks[i])
                }
                for i in range(len(final_scores))
            ]
        }
