import numpy as np


class LDA:
    def __init__(self, n_components=None):
        self.n_components = n_components
        self.eig_vectors = None

    def transform(self, X, y):
        height, width = X.shape
        unique_classes = np.unique(y)
        num_classes = len(unique_classes)

        scatter_t = np.cov(X.T) * (height - 1)
        scatter_w = 0
        for i in range(num_classes):
            class_items = np.flatnonzero(y == unique_classes[i])
            scatter_w = scatter_w + np.cov(X[class_items].T) * (len(class_items) - 1)

        scatter_b = scatter_t - scatter_w
        _, eig_vectors = np.linalg.eigh(np.linalg.pinv(scatter_w).dot(scatter_b))
        pc = X.dot(eig_vectors[:, ::-1][:, : self.n_components])
        response = []
        if self.n_components == 2:
            labels = np.unique(y)
            for label in labels:
                class_data = pc[np.flatnonzero(y == label)]
                item = {
                    "x": class_data[:, 0].tolist(),
                    "y": class_data[:, 1].tolist(),
                    "label": int(label),
                }
                response.append(item)
        return response
