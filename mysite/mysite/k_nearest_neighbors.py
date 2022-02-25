from help_functions import *
from collections import Counter     # TODO: might need to implement it myself


class KNN:
    def __init__(self, k=3):
        self.k = k
        self.x_train, self.y_train = None, None

    def fit(self, x, y):
        self.x_train = x
        self.y_train = y

    def predict(self, x):
        y_pred = [self._predict(i) for i in x]
        return np.array(y_pred)

    def _predict(self, x):
        # compute distances between x and all examples in the training set
        distances = [euclidean_distance(x, x_train) for x_train in self.x_train]
        # sort by distance and return indices of the first k neighbors
        k_idx = np.argsort(distances)[: self.k]
        # extract the labels of the k nearest neighbor training samples
        k_neighbor_labels = [self.y_train[i] for i in k_idx]
        # return the most common class label
        most_common = Counter(k_neighbor_labels).most_common(1)
        return most_common[0][0]
