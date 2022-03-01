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
        max_iterations, k = output_dict['max_iterations'], output_dict['k']
        kmeans = k_means.KMeans(k=k, max_iterations=max_iterations)

        # we suppose that the data is in 2d

        points_x = [x for x in output_dict['points_x']]
        points_y = [x for x in output_dict['points_y']]

        points = np.asarray(list(np.asarray(zip(points_x, points_y))))
        predictions = kmeans.predict(points)

        return render(request, 'kmeans_home.html', predictions)

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

        points_x = [x for x in output_dict['points_x']]
        points_y = [x for x in output_dict['points_y']]

        points = np.asarray(list(np.asarray(zip(points_x, points_y))))
        points_labels = np.asarray([x for x in output_dict['points_labels']])

        lda = linear_discriminant_analysis.LDA(2)
        lda.fit(points, points_labels)

        x_projected = lda.transform(points)

        return render(request, 'lda_home.html', {'x_projected': x_projected})

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

        train_x = [x for x in output_dict['train_x']]
        train_y = [x for x in output_dict['train_y']]

        train_points = np.asarray(list(np.asarray(zip(train_x, train_y))))
        points_labels = np.asarray([x for x in output_dict['points_labels']])

        naive_bayes = naive_bayes_classifier.NaiveBayes()
        naive_bayes.fit(train_points, points_labels)

        test_x = [x for x in output_dict['test_x']]
        test_y = [x for x in output_dict['test_y']]

        test_points = np.asarray(list(np.asarray(zip(test_x, test_y))))
        predictions = naive_bayes.predict(test_points)

        return render(request, 'naive_bayes_home.html', {'predictions': predictions})

    return render(request, 'naive_bayes_home.html')


def pca_home(request):
    if request.method == "POST":
        output = request.get_json()
        output_dict = json.loads(output)  # now the data is stored in a python dictionary
        n_components = output_dict['n_components']      # an integer in the range [1, 3]

        pca = principal_components_analysis.PCA(n_components=n_components)
        if n_components == 1:
            train_x = np.asarray([x for x in output_dict['train_x']])
            pca.fit(train_x)
            x_projected = pca.transform(train_x)
            p1 = x_projected[:, 0]
            return render(request, 'pca_home.html', {'p1': p1})

        if n_components == 2:
            train_x = [x for x in output_dict['train_x']]
            train_y = [x for x in output_dict['train_y']]
            train_data = np.asarray(list(np.asarray(zip(train_x, train_y))))
            pca.fit(train_data)
            x_projected = pca.transform(train_data)
            p1 = x_projected[:, 0]
            p2 = x_projected[:, 1]
            return render(request, 'pca_home.html', {'p1': p1, 'p2': p2})

        train_x = [x for x in output_dict['train_x']]
        train_y = [x for x in output_dict['train_y']]
        train_z = [x for x in output_dict['train_z']]
        train_data = np.asarray(list(np.asarray(zip(train_x, train_y, train_z))))
        pca.fit(train_data)
        x_projected = pca.transform(train_data)
        p1 = x_projected[:, 0]
        p2 = x_projected[:, 1]
        p3 = x_projected[:, 2]
        return render(request, 'pca_home.html', {'p1': p1, 'p2': p2, 'p3': p3})

    return render(request, 'pca_home.html')


def svm_home(request):
    if request.method == "POST":
        output = request.get_json()
        output_dict = json.loads(output)  # now the data is stored in a python dictionary
        learning_rate, lambda_param = output_dict['learning_rate'], output_dict['lambda_param']
        n_iterations = output_dict['n_iterations']

        svm = support_vectors_machines.SVM(learning_rate, lambda_param, n_iterations)

        # we suppose the input is in 2d

        points_x = [x for x in output_dict['points_x']]
        points_y = [x for x in output_dict['points_y']]
        points = np.asarray(list(np.asarray(zip(points_x, points_y))))

        points_labels = np.asarray([x for x in output_dict['points_labels']])

        svm.fit(points, points_labels)

        return render(request, 'svm_home.html', {'w': svm.w, 'b': svm.b})

    return render(request, 'svm_home.html')
