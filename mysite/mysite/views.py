from django.shortcuts import render
from depth_first_search import *
from k_means import KMeans
from k_nearest_neighbors import KNN
from linear_discriminant_analysis import LDA
from naive_bayes_classifier import NaiveBayes
from principal_components_analysis import PCA


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
