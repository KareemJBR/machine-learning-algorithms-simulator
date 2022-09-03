import json
import logging

import numpy as np
from django.http import JsonResponse
from django.shortcuts import render

from core.algorithms import KNN
from core.utils import upload_file


def choose_knn(request):
    return render(request, "knn/choose_knn.html")


def knn(request):
    if request.method == "POST":
        output = request.get_json()
        print("KNN output", output)
        output_dict = json.loads(
            output
        )  # now the data is stored in a python dictionary
        test_x = [x for x in range(output_dict["width"])]
        test_y = [x for x in range(output_dict["height"])]
        test_points = np.asarray(list(np.asarray(zip(test_x, test_y))))

        train_x = [x for x in output_dict["train_x"]]
        train_y = [x for x in output_dict["train_y"]]
        train_points = np.asarray(list(np.asarray(zip(train_x, train_y))))

        train_labels = np.asarray([x for x in output_dict["train_classes"]])
        knn = KNN(k=output_dict["k"])

        knn.fit(train_points, train_labels)
        predictions = knn.predict(test_points)

        return render(
            request,
            "knn/knn_home.html",
            {"predictions": predictions},
        )
    return render(
        request,
        "knn/knn_home.html",
    )


def knn_custom(request):
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

    return render(request, "knn/knn_custom.html")
