import numpy as np


class LDA:
    def __init__(self, n_components):
        self.n_components = n_components
        self.linear_discriminants = None

    def fit(self, x, y):
        n_features = x.shape[1]
        class_labels = np.unique(y)

        mean_overall = np.mean(x, axis=0)
        s_w = np.zeros((n_features, n_features))
        s_b = np.zeros((n_features, n_features))
        for c in class_labels:
            x_c = x[y == c]
            mean_c = np.mean(x_c, axis=0)
            # (4, n_c) * (n_c, 4) = (4,4) -> transpose
            s_w += (x_c - mean_c).T.dot((x_c - mean_c))

            # (4, 1) * (1, 4) = (4,4) -> reshape
            n_c = x_c.shape[0]
            mean_diff = (mean_c - mean_overall).reshape(n_features, 1)
            s_b += n_c * mean_diff.dot(mean_diff.T)

        a = np.linalg.inv(s_w).dot(s_b)
        # get eigenvalues and eigenvectors of s_w^-1 * s_b
        eigenvalues, eigenvectors = np.linalg.eig(a)
        # eigenvector v = [:,i] column vector, transpose for easier calculations
        # sort eigenvalues high to low
        eigenvectors = eigenvectors.T
        idxs = np.argsort(abs(eigenvalues))[::-1]
        eigenvectors = eigenvectors[idxs]
        # store first n eigenvectors
        self.linear_discriminants = eigenvectors[0: self.n_components]

    def transform(self, x):
        # project data
        return np.dot(x, self.linear_discriminants.T)
