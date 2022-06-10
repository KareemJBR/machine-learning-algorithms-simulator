import numpy as np


class PCA:
    def __init__(self, n_components):
        self.n_components = n_components
        self.mean = None

    def transform(self, x):
        # Mean centering
        self.mean = x - np.mean(x, axis=0)
        # covariance, function needs samples as columns
        covariance_matrix = np.cov(x.T)
        # eigenvalues, eigenvectors
        eigen_values, eigen_vectors = np.linalg.eigh(covariance_matrix)

        # eigenvector v = [:,i] column vector, transpose for easier calculations
        # sort eigenvectors
        sorted_index = np.argsort(eigen_values)[::-1]
        eigen_values[sorted_index]
        sorted_eigenvectors = eigen_vectors[:, sorted_index]

        eigenvector_subset = sorted_eigenvectors[:, 0 : self.n_components]

        x_reduced = np.dot(
            eigenvector_subset.transpose(), self.mean.transpose()
        ).transpose()
        return x_reduced
