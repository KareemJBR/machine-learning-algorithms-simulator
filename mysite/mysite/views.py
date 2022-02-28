import numpy as np
from django.shortcuts import render
import json
from . import depth_first_search, k_means, k_nearest_neighbors, linear_discriminant_analysis
from . import maximum_likelihood_estimation, naive_bayes_classifier, principal_components_analysis
from . import support_vectors_machines


def home(request):
    return render(request, 'home.html')


def dfs_home(request):
    if request.method == "POST":
        output = request.get_json()
        output_dict = json.loads(output)  # now the data is stored in a python dictionary

    return render(request, 'dfs_home.html')


def kmeans_home(request):
    if request.method == "POST":
        output = request.get_json()
        output_dict = json.loads(output)  # now the data is stored in a python dictionary

    return render(request, 'kmeans_home.html')


def knn_home(request):
    if request.method == "POST":
        output = request.get_json()
        output_dict = json.loads(output)   # now the data is stored in a python dictionary
        test_x = [x for x in range(output_dict['width'])]
        test_y = [x for x in range(output_dict['height'])]
        test_points = np.asarray(list(np.asarray(zip(test_x, test_y))))

        train_x = [x for x in output_dict['train_x']]
        train_y = [x for x in output_dict['train_y']]
        train_points = np.asarray(list(np.asarray(zip(train_x, train_y))))

        train_labels = np.asarray([x for x in output_dict['train_classes']])
        knn = k_nearest_neighbors.KNN(k=output_dict['k'])

        knn.fit(train_points, train_labels)
        predictions = knn.predict(test_points)
        return render(request, 'knn_home.html', {'predictions': predictions})

    return render(request, 'knn_home.html', {'test': str(request.method)})


def lda_home(request):
    if request.method == "POST":
        output = request.get_json()
        output_dict = json.loads(output)  # now the data is stored in a python dictionary

    return render(request, 'lda_home.html')


def mle_home(request):
    if request.method == "POST":
        output = request.get_json()
        output_dict = json.loads(output)  # now the data is stored in a python dictionary

    return render(request, 'mle_home.html')


def naive_bayes_home(request):
    if request.method == "POST":
        output = request.get_json()
        output_dict = json.loads(output)  # now the data is stored in a python dictionary

    return render(request, 'naive_bayes_home.html')


def pca_home(request):
    if request.method == "POST":
        output = request.get_json()
        output_dict = json.loads(output)  # now the data is stored in a python dictionary

    return render(request, 'pca_home.html')


def svm_home(request):
    if request.method == "POST":
        output = request.get_json()
        output_dict = json.loads(output)  # now the data is stored in a python dictionary

    return render(request, 'svm_home.html')
