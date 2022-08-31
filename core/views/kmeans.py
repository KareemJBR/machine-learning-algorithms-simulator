import json
import logging

import numpy as np
from django.http import JsonResponse
from django.shortcuts import render

from core.algorithms import KMeans
from core.utils import upload_file


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
    if request.method == "POST":
        try:
            df = upload_file(request)
            if len(df.columns) < 2:
                return JsonResponse(
                    {
                        "error": "Less than 2 columns in a dataset. Please, upload the dataset that contains only 2 columns (where 1st column contains X coordinates and 2nd column contains Y coordinates)."
                    }
                )
            if len(df.columns) > 2:
                return JsonResponse(
                    {
                        "error": "More than 2 columns in a dataset. Please, upload the dataset that contains only 2 columns (where 1st column contains X coordinates and 2nd column contains Y coordinates)."
                    }
                )
            points_x = list(df.iloc[:, 0])
            points_y = list(df.iloc[:, 1])
            if len(points_x) != len(points_y):
                return JsonResponse(
                    {"error": "The number of rows for сolumns is different."}
                )
            points = []
            for index, (value1, value2) in enumerate(zip(points_x, points_y)):
                point = {"x": value1, "y": value2}
                points.append(point)
            return JsonResponse({"points": points})
        except Exception as e:
            logging.getLogger("error_logger").error("Error: " + repr(e))
            return JsonResponse(
                {
                    "error": "Dataset does not meet the requirements. Please upload a new one."
                }
            )

    return render(request, "kmeans/kmeans_custom.html")
