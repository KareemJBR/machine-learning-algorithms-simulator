import math
import numpy as np

from .mean import mean


def sigma(x):
    T = len(x)
    mu = mean(x)
    s = sum(np.power((x - mu), 2))
    # Compute sigma^2
    sigma_squared = 1.0 / T * s
    return math.sqrt(sigma_squared)
