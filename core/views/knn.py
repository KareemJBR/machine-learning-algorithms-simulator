import json

import numpy as np
from django.shortcuts import render

from core.algorithms import KNN


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
            "knn_home.html",
            {"predictions": predictions},
        )
    return render(
        request,
        "knn_home.html",
    )
