from django.shortcuts import render
from . import depth_first_search, k_means, k_nearest_neighbors, linear_discriminant_analysis
from . import maximum_likelihood_estimation, naive_bayes_classifier, principal_components_analysis
from . import support_vectors_machines


def home(request):
    return render(request, 'home.html')


def dfs_home(request):
    visited_nodes_id = []
    #   TODO: we shall build the Node and Edge objects then call DFS function
    return render(request, 'dfs_home.html')


def kmeans_home(request):
    kmeans = k_means.KMeans(request['k'], request['max_iterations'])
    request['results'] = kmeans.predict(request['data'])
    return render(request, 'kmeans_home.html')


def knn_home(request):
    knn = k_nearest_neighbors.KNN(request['k'])
    knn.fit(request['x_train'], request['y_request'])
    request['results'] = knn.predict(request['x_test'])
    return render(request, 'knn_home.html')


def lda_home(request):
    lda = linear_discriminant_analysis.LDA(request['n_components'])
    lda.fit(request['x'], request['y'])
    request['results'] = lda.linear_discriminants
    return render(request, 'lda_home.html')


#   TODO: Implement MLE in maximum_likelihood_estimation.py file
def mle_home(request):
    mle = maximum_likelihood_estimation.MLClassifier()

    return render(request, 'mle_home.html')


def naive_bayes_home(request):
    x_train, y_train = request['x_train'], request['y_train']
    naive_bayes = naive_bayes_classifier.NaiveBayes(x_train, y_train)
    request['results'] = naive_bayes.predict(request['x_test'])
    return render(request, 'naive_bayes_home.html')


def pca_home(request):
    pca = principal_components_analysis.PCA(request['n_components'])
    pca.fit(request['data'])
    request['results'] = pca.components
    return render(request, 'pca_home.html')


def svm_home(request):
    svm = support_vectors_machines.SVM(request['learning_rate'], request['lambda_param'], request['n_iterations'])
    x, y = request['x'], request['y']
    svm.fit(x, y)
    request['w'], request['b'] = svm.w, svm.b
    return render(request, 'svm_home.html')
