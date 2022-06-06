import numpy as np
import matplotlib.pyplot as plt

plt.switch_backend("agg")


class SVM:
    def __init__(self, param=1.0):
        self._support_vectors = None
        self.param = param
        self.beta = None
        self.b = None
        self.x = None
        self.y = None

        # n is the number of data points
        self.n = 0

        # d is the number of dimensions
        self.d = 0

    def __decision_function(self, x):
        return x.dot(self.beta) + self.b

    def __cost(self, margin):
        return (1 / 2) * self.beta.dot(self.beta) + self.param * np.sum(
            np.maximum(0, 1 - margin)
        )

    def __margin(self, x, y):
        return y * self.__decision_function(x)

    def fit(self, x, y, lr=1e-3, epochs=500):
        # Initialize Beta and b
        self.n, self.d = x.shape
        self.beta = np.random.randn(self.d)
        self.b = 0

        # Required only for plotting
        self.x = x
        self.y = y

        loss_array = []
        for _ in range(epochs):
            margin = self.__margin(x, y)
            loss = self.__cost(margin)
            loss_array.append(loss)

            misclassified_pts_idx = np.where(margin < 1)[0]
            d_beta = self.beta - self.param * y[misclassified_pts_idx].dot(
                x[misclassified_pts_idx]
            )
            self.beta = self.beta - lr * d_beta

            d_b = -self.param * np.sum(y[misclassified_pts_idx])
            self.b = self.b - lr * d_b

        self._support_vectors = np.where(self.__margin(x, y) <= 1)[0]

    def predict(self, x):
        return np.sign(self.__decision_function(x))

    def score(self, x, y):
        p = self.predict(x)
        return np.mean(y == p)

    def plot(self):
        ax = plt.gca()
        x_lim = ax.get_xlim()
        y_lim = ax.get_ylim()
        # create grid to evaluate model
        xx = np.linspace(x_lim[0], x_lim[1], 30)
        yy = np.linspace(y_lim[0], y_lim[1], 30)
        yy, xx = np.meshgrid(yy, xx)
        xy = np.vstack([xx.ravel(), yy.ravel()]).T
        z = self.__decision_function(xy).reshape(xx.shape)

        item = {
            "x": self.x[:, 0].tolist(),
            "y": self.x[:, 1].tolist(),
            "z": z.tolist(),
            "color": self.y.tolist(),
        }
        return item
