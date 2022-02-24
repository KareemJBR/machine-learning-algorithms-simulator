from django.shortcuts import render
from django.http import HttpResponse

import numpy as np
import matplotlib.pyplot as plt


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


def k_means():
    pass


def lda():
    pass


def mle():
    pass


def naive_bayes_classifier(num_of_classes, train_data, input_points_class, test_data):
    results = []



    i = -1
    for point in train_data:
        i += 1
        #   if input_points_class[i] ==


    return results


def pca(data):  # PCA is an unsupervised algorithm, thus we do not have test/train data
    #   we shall subtract the mean first
    means = []

    for dimension in range(len(data[0])):
        sum = 0
        for point in data:
            sum += point[dimension]
        means.append(sum/len(data))

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
    sorted_eigenvalue = eigen_values[sorted_index]

    #   sorting the eigenvectors in a similar way
    sorted_eigenvectors = eigen_vectors[:, sorted_index]

    eigenvector_subset = sorted_eigenvectors[:, 0:len(data[0])]

    #   transforming the data
    final_result = np.dot(eigenvector_subset.transpose(), data.transpose()).transpose()
    return final_result


def svm():
    pass

