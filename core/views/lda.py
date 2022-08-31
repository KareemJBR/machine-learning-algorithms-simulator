import base64
import json
import logging
from io import BytesIO

import numpy as np
import pandas as pd
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import matplotlib.pyplot as plt
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

from core.algorithms import LDA
from core.utils import upload_file
from setup.settings import TEMPORARY_FILE_DIR


plt.switch_backend("agg")


@csrf_exempt
def choose_lda(request):
    return render(request, "lda/choose_lda.html")


@csrf_exempt
def lda(request):
    if request.method == "POST":
        output_dict = json.loads(request.body)
        X, y = np.array(output_dict["points_x"]), output_dict["points_y"]
        X_train, X_test, Y_train, Y_test = train_test_split(X, y, test_size=0.2)
        LDA_object = LDA(n_components=2)
        response = LDA_object.transform(X_train, Y_train)
        return JsonResponse({"data": response})
    return render(request, "lda/lda_home.html")


@csrf_exempt
def lda_custom(request):
    if request.method == "POST":
        df = upload_file(request)
        column_headers = list(df.columns)
        if len(column_headers) > 0:
            return render(
                request,
                "lda/lda_custom.html",
                {"column_headers": column_headers},
            )
    if request.method == "PUT":
        try:
            df = pd.read_csv(f"{TEMPORARY_FILE_DIR}/user_file.csv", sep=",")
            output_dict = json.loads(request.body)
            target_column = output_dict["target_column"]
            features = list(df.columns)
            features.remove(target_column)
            # split the descriptive and the target feature
            X = df[features].values
            y = df[target_column].values

            # Feature Scaling
            sc = StandardScaler()
            X = sc.fit_transform(X)

            # Splitting the dataset into the Training set and Test set
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=0
            )

            # 1. Instantiate the method and fit_transform the algotithm
            LDA = LinearDiscriminantAnalysis(
                n_components=2
            )  # The n_components key word gives us the projection to the n most discriminative directions in the dataset. We set this parameter to two to get a transformation in two dimensional space.
            data_projected = LDA.fit_transform(X_train, y_train)

            # PLot the transformed data
            markers = ["s", "x", "o"]
            colors = ["r", "g", "b"]

            fig = plt.figure(figsize=(10, 10))
            ax0 = fig.add_subplot(111)

            for l, m, c in zip(np.unique(y_train), markers, colors):
                ax0.scatter(
                    data_projected[:, 0][y_train == l],
                    data_projected[:, 1][y_train == l],
                    c=c,
                    marker=m,
                )

            buffer = BytesIO()
            plt.savefig(buffer, format="png")
            buffer.seek(0)
            image_png = buffer.getvalue()
            buffer.close()

            image = base64.b64encode(image_png)
            image = image.decode("utf-8")

            return JsonResponse({"image": image})
        except Exception as e:
            logging.getLogger("error_logger").error("Error: " + repr(e))
            valid_columns = []
            df = pd.read_csv(f"{TEMPORARY_FILE_DIR}/user_file.csv", sep=",")
            features = list(df.columns)
            X = df[features].values
            for feature in features:
                try:
                    y = df[feature].values
                    sc = StandardScaler()
                    X = sc.fit_transform(X)
                    X_train, X_test, y_train, y_test = train_test_split(
                        X, y, test_size=0.2, random_state=0
                    )
                    LDA = LinearDiscriminantAnalysis(n_components=2)
                    data_projected = LDA.fit_transform(X_train, y_train)
                    markers = ["s", "x", "o"]
                    colors = ["r", "g", "b"]
                    fig = plt.figure(figsize=(10, 10))
                    ax0 = fig.add_subplot(111)
                    for l, m, c in zip(np.unique(y_train), markers, colors):
                        ax0.scatter(
                            data_projected[:, 0][y_train == l],
                            data_projected[:, 1][y_train == l],
                            c=c,
                            marker=m,
                        )
                    valid_columns.append(feature)
                except Exception as err:
                    if type(err) == IndexError:
                        valid_columns.append(feature)
                    elif err == ValueError(
                        "could not convert string to float: 'setosa'"
                    ):
                        valid_columns.append(feature)
                    else:
                        pass
            if len(valid_columns) > 0:
                return JsonResponse(
                    {"error": f"Only columns {valid_columns} meet the requirements."}
                )
            else:
                return JsonResponse(
                    {
                        "error": "No columns meet the requirements. Please upload a new dataset."
                    }
                )
    return render(request, "lda/lda_custom.html")
