import json

import numpy as np
from django.shortcuts import render

from core.algorithms import KMeans


def choose_kmeans(request):
    return render(request, "kmeans/choose_kmeans.html")


def kmeans(request):
    if request.method == "POST":
        output = request.get_json()
        output_dict = json.loads(
            output
        )  # now the data is stored in a python dictionary
        max_iterations, k = output_dict["max_iterations"], output_dict["k"]
        kmeans = KMeans(k=k, max_iterations=max_iterations)

        # we suppose that the data is in 2d

        points_x = [x for x in output_dict["points_x"]]
        points_y = [x for x in output_dict["points_y"]]

        points = np.asarray(list(np.asarray(zip(points_x, points_y))))
        predictions = kmeans.predict(points)

        return render(request, "kmeans/kmeans_home.html", predictions)

    return render(request, "kmeans/kmeans_home.html")


def kmeans_custom(request):
    return render(request, "kmeans/kmeans_custom.html")
