import numpy as np
from django.shortcuts import render
import json
from . import depth_first_search, k_means, k_nearest_neighbors, linear_discriminant_analysis
from . import maximum_likelihood_estimation, naive_bayes_classifier, principal_components_analysis
from . import support_vectors_machines


def home(request):
    return render(request, 'home.html')


def dfs_home(request):
    return render(request, 'dfs_home.html')


def kmeans_home(request):
    return render(request, 'kmeans_home.html')


def knn_home(request):
    return render(request, 'knn_home.html', {'test': str(request.method)})


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
