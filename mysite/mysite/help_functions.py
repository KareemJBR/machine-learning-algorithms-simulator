from numpy import sqrt as sq
from numpy import sum as su


def euclidean_distance(x1, x2):
    return sq(su((x1 - x2) ** 2))
