import numpy as np


class NaiveBayes:
    def __init__(self, x, y):
        self.y = y
        self.classes_mean = {}
        self.classes_variance = {}
        self.classes_prior = {}
        self.num_examples, self.num_features = x.shape
        self.num_classes = len(np.unique(y))
        self.eps = 1e-6

    def fit(self, x):
        self.classes_mean = {}
        self.classes_variance = {}
        self.classes_prior = {}

        for c in range(self.num_classes):
            x_c = x[self.y == c]

            self.classes_mean[str(c)] = np.mean(x_c, axis=0)
            self.classes_variance[str(c)] = np.var(x_c, axis=0)
            self.classes_prior[str(c)] = x_c.shape[0] / x.shape[0]

    def predict(self, x):
        probs = np.zeros((self.num_examples, self.num_classes))

        for c in range(self.num_classes):
            prior = self.classes_prior[str(c)]
            probs_c = self.density_function(
                x, self.classes_mean[str(c)], self.classes_variance[str(c)]
            )
            probs[:, c] = probs_c + np.log(prior)

        return np.argmax(probs, 1)

    def density_function(self, x, mean, sigma):
        # Calculate probability from Gaussian density function
        const = -self.num_features / 2 * np.log(2 * np.pi) - 0.5 * np.sum(
            np.log(sigma + self.eps)
        )
        probs = 0.5 * np.sum(np.power(x - mean, 2) / (sigma + self.eps), 1)
        return const - probs
