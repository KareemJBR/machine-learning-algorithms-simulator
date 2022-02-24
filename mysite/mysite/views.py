from django.shortcuts import render
from scipy.spatial.distance import cdist
import numpy as np


def home(request):
    return render(request, 'home.html')


def dfs_home(request):
    return render(request, 'dfs_home.html')


def kmeans_home(request):
    return render(request, 'kmeans_home.html')


def knn_home(request):
    return render(request, 'knn_home.html')


def lda_home(request):
    return render(request, 'lda_home.html')


def mle_home(request):
    return render(request, 'mle_home.html')


def naive_bayes_home(request):
    return render(request, 'naive_bayes_home.html')


def pca_home(request):
    return render(request, 'pca_home.html')


def svm_home(request):
    return render(request, 'svm_home.html')


def k_nearest_neighbors(k, train_data, input_points_class, test_data):
    """

        :param k: The k parameter in the algorithm k-nearest-neighbors
        :param train_data: The points in the training data, each point has two coordinates, x and y. In addition,
        it has the id of the class it is in
        :param input_points_class: The input points' classification vector
        :param test_data: A vector containing the test data.
        :return: A list of the same length of the test data indicating the classes the algorithm decides for the points
        in `output_points` in the output window

    """

    results = []
    if len(train_data) == 0:
        raise ValueError("Invalid training data.")

    d = len(train_data[0])
    for test_point in test_data:
        distances = []

        for i in range(len(train_data)):
            distance = 0
            for feature in range(d):
                distance += pow(train_data[i][feature] - test_point[feature], 2)
            distances.append((np.sqrt(distance), input_points_class[i]))

        distances.sort(key=lambda x: x[0])

        k_closest = []
        for i in range(k):
            k_closest.append(distances[i][1])

        for i in range(k, len(distances)):
            if distances[i][0] == k_closest[k - 1]:
                k_closest.append(distances[i][1])

        most_common = None
        times_appeared = 0

        for i in range(len(k_closest)):
            temp = k_closest.count(k_closest[i])
            if temp > times_appeared:
                most_common = k_closest[i]
                times_appeared = temp

        for i in range(len(k_closest)):
            if most_common != k_closest[i] and times_appeared == k_closest.count(k_closest[i]):     # the algorithm
                #   cannot decide which class is the right one
                most_common = None
                break

        results.append(most_common)

    return results


def kmeans(x, k, no_of_iterations):
    idx = np.random.choice(len(x), k, replace=False)
    # first we need to choose random centroids
    centroids = x[idx, :]

    # finding the distance between centroids and all the data points
    distances = cdist(x, centroids, 'euclidean')

    # centroid with the minimum Distance
    points = np.array([np.argmin(i) for i in distances])

    # repeating the above steps for a defined number of iterations
    for _ in range(no_of_iterations):
        centroids = []
        for idx in range(k):
            # updating centroids by taking mean of cluster it belongs to
            temp_cent = x[points == idx].mean(axis=0)
            centroids.append(temp_cent)

        centroids = np.vstack(centroids)

        distances = cdist(x, centroids, 'euclidean')
        points = np.array([np.argmin(i) for i in distances])

    return points


def lda():
    pass


def mle():
    pass


def pca(data):  # PCA is an unsupervised algorithm, thus we do not have test/train data
    #   we shall subtract the mean first
    means = []

    for dimension in range(len(data[0])):
        sum_ = 0
        for point in data:
            sum_ += point[dimension]
        means.append(sum_/len(data))

    for i in range(len(data)):
        for j in range(len(data[0])):
            data[i][j] -= means[j]

    #   calculating the covariance matrix

    frames = np.asarray(data)
    cov_mat = np.cov(frames)

    #   calculating eigenvalues and eigenvectors of the covariance matrix
    eigen_values, eigen_vectors = np.linalg.eigh(cov_mat)

    # sort the eigenvalues in descending order
    sorted_index = np.argsort(eigen_values)[::-1]

    #   sorting the eigenvectors in a similar way
    sorted_eigenvectors = eigen_vectors[:, sorted_index]

    eigenvector_subset = sorted_eigenvectors[:, 0:len(data[0])]

    #   transforming the data
    final_result = np.dot(eigenvector_subset.transpose(), data.transpose()).transpose()
    return final_result


def svm():
    pass


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
