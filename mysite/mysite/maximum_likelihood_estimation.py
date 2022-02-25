import numpy as np


def ML_estimator(dataset):
    mean = np.mean(dataset, axis=0)
    variance = np.var(dataset, axis=0)
    return mean, variance


def variance_square_mat(var):
    return np.multiply(var, [[1, 0], [0, 1]])


def BayesClassifier(test_point, mean, variance):
    mean = np.array([mean])
    x = test_point-mean
    p1 = ((1 / (2 * np.pi) ** 0.5)/(np.linalg.det(variance))) ** 0.5
    p2 = np.exp(-0.5 * np.matmul(np.matmul(x, np.linalg.inv(variance)), np.transpose(x)))
    return (1/3) * p1 * p2     # 1/3 is the prior probability
