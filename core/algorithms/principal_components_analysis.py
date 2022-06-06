import numpy as np


class PCA:
    def __init__(self, n_components):
        self.n_components = n_components
        self.components = None
        self.mean = None

    def fit(self, x):
        # Mean centering
        self.mean = np.mean(x, axis=0)
        x = x - self.mean

        # covariance, function needs samples as columns
        cov = np.cov(x.T)

        # eigenvalues, eigenvectors
        eigenvalues, eigenvectors = np.linalg.eig(cov)

        # eigenvector v = [:,i] column vector, transpose for easier calculations
        # sort eigenvectors
        eigenvectors = eigenvectors.T
        idxs = np.argsort(eigenvalues)[::-1]
        eigenvectors = eigenvectors[idxs]

        # store first n eigenvectors
        self.components = eigenvectors[0: self.n_components]

    def transform(self, x):
        # project data
        x = x - self.mean
        return np.dot(x, self.components.T)
