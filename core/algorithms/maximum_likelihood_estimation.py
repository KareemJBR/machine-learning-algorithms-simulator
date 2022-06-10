import numpy as np


class MLClassifier:
    def __init__(self):
        self.d, self.n_classes, self.mu_list = None, None, None
        self.sigma_inv_list = None
        self.scalars = None

    def fit(self, x: np.ndarray, y: np.ndarray) -> None:
        # no. of variables / dimension
        self.d = x.shape[1]

        # no. of classes assumes labels to be integers from 0 to n_classes - 1
        self.n_classes = len(set(y))

        # list of means; mu_list[i] is mean vector for label i
        self.mu_list = []

        # list of inverse covariance matrices
        # sigma_list[i] is inverse covariance matrix for label i
        # for efficiency reasons we store only the inverses
        self.sigma_inv_list = []

        # list of scalars in front of e^...
        self.scalars = []

        n = x.shape[0]
        for i in range(self.n_classes):

            # subset of observations for label i
            cls_x = np.array([x[j] for j in range(n) if y[j] == i])

            mu = np.mean(cls_x, axis=0)

            # row_var = False, this is to use columns as variables instead of rows
            sigma = np.cov(cls_x, rowvar=False)
            sigma_inv = np.linalg.inv(sigma)

            scalar = 1 / np.sqrt(((2 * np.pi) ** self.d) * np.linalg.det(sigma))

            self.mu_list.append(mu)
            self.sigma_inv_list.append(sigma_inv)
            self.scalars.append(scalar)

    def _class_likelihood(self, x: np.ndarray, cls: int) -> float:
        mu = self.mu_list[cls]
        sigma_inv = self.sigma_inv_list[cls]
        scalar = self.scalars[cls]
        exp = (-1 / 2) * np.dot(np.matmul(x - mu, sigma_inv), x - mu)

        return scalar * (np.e**exp)

    def predict(self, x: np.ndarray) -> int:
        likelihoods = [self._class_likelihood(x, i) for i in range(self.n_classes)]
        return np.argmax(likelihoods)

    def score(self, x: np.ndarray, y: np.ndarray) -> float:
        n = x.shape[0]
        predicted_y = np.array([self.predict(x[i]) for i in range(n)])
        n_correct = np.sum(predicted_y == y)
        return n_correct / n
