import numpy
from django.shortcuts import render
from django.http import HttpResponse

import numpy as np
import matplotlib.pyplot as plt
import cv2.cv2 as cv2

import dfs_algo
import k_means_algo
import k_nearest_neighbors_algo
import linear_discriminant_analysis
import maximum_likelihood_estimation
import naive_bayes_classifier_algo
import principal_component_analysis
import svm_algo


def home(request):
    return render(request, 'home.html')


def dfs_home(request):
    train_data, test_data = request.GET['train_data'], request.GET['test_data']
    return render(request, 'dfs_home.html')


def kmeans_home(request):
    train_data, test_data, k_value = request.GET['train_data'], request.GET['test_data'], request.GET['k']
    return render(request, 'kmeans_home.html')


def knn_home(request):
    train_data, test_data = request.GET['train_data'], request.GET['test_data']
    return render(request, 'knn_home.html')


def lda_home(request):
    train_data, test_data = request.GET['train_data'], request.GET['test_data']
    return render(request, 'lda_home.html')


def mle_home(request):
    train_data, test_data = request.GET['train_data'], request.GET['test_data']
    return render(request, 'mle_home.html')


def naive_bayes_home(request):
    train_data, test_data = request.GET['train_data'], request.GET['test_data']
    return render(request, 'naive_bayes_home.html')


def pca_home(request):
    train_data, test_data = request.GET['train_data'], request.GET['test_data']
    return render(request, 'pca_home.html')


def svm_home(request):
    return render(request, 'svm_home.html')
