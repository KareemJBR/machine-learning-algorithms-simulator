import json

import pandas as pd
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from pandas.core.frame import DataFrame

from core.algorithms import NaiveBayes
from core.utils import upload_file
from setup.settings import TEMPORARY_FILE_DIR


@csrf_exempt
def choose_naive_bayes(request):
    return render(request, "naive_bayes/choose_naive_bayes.html")


@csrf_exempt
def naive_bayes(request):
    if request.method == "POST":
        # upload Iris dataset -  shape is (150, 5)
        df = pd.read_csv(
            "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv"
        )
        # shuffle dataset with sample
        df = df.sample(frac=1, random_state=1).reset_index(drop=True)
        print("**DF**", df)
        # set features and target
        X, y = df.iloc[:, :-1], df.iloc[:, -1]
        print("**X**", X)
        print("**y**", y)

        # # split on train and test (0.7|0.3)
        X_train, X_test, y_train, y_test = X[:100], X[100:], y[:100], y[100:]
        print("**X_train**", X_train)
        print("**y_train**", y_train)
        print("**X_test**", X_test)
        print("**y_test**", y_test)

        x = NaiveBayes()
        print("**x**", x)

        x.fit(X_train, y_train)
        predictions = x.predict(X_test)
        print("**predictions**", predictions)

        accuracy = x.accuracy(y_test, predictions)
        print("**accuracy**", accuracy)

        predicted_dict = x.get_formatted_predicted_values(predictions, "Species")
        print("**predicted_dict**", predicted_dict)

        data = {"accuracy": accuracy}
        for key, value in predicted_dict.items():
            data[key[0]] = value
            print("**value**", value)

        print("DATA", data)
        return JsonResponse({"data": data})
    return render(request, "naive_bayes/naive_bayes_home.html")


@csrf_exempt
def naive_bayes_custom(request):
    if request.method == "POST":
        df: DataFrame = upload_file(request)
        df = df.sample(frac=1, random_state=1).reset_index(drop=True)
        column_headers = list(df.columns)
        if len(column_headers) > 0:
            return render(
                request,
                "naive_bayes/naive_bayes_custom.html",
                {"column_headers": column_headers},
            )
    if request.method == "PUT":
        output_dict = json.loads(request.body)
        target_column = output_dict["type"]
        print("TYPE: ", target_column)
        df: DataFrame = pd.read_csv(f"{TEMPORARY_FILE_DIR}/user_file.csv", sep=",")
        print("DF", df)
        df = df.sample(frac=1, random_state=1).reset_index(drop=True)
        print("**DF**", df)
        # set features and target columns
        X, y = df.iloc[:, :-1], df.iloc[:, -1]
        print("**X**", X)

        print("**y**", y)
        df_len: int = len(df)
        print("**df_len**", df_len)

        X_train, X_test, y_train, y_test = (
            X[: int(df_len * 0.8)],
            X[-int(df_len * 0.2) :],
            y[: int(df_len * 0.8)],
            y[-int(df_len * 0.2) :],
        )
        # X_train, X_test, y_train, y_test = X[:100], X[100:], y[:100], y[100:]
        print("**X_train**", X_train)
        print("**y_train**", y_train)
        print("**X_test**", X_test)
        print("**y_test**", y_test)

        x = NaiveBayes()
        print("**x**", x)
        x.fit(X_train, y_train)

        predictions = x.predict(X_test)
        print("**predictions**", predictions)

        accuracy = x.accuracy(y_test, predictions)
        print("Accuracy", accuracy)

        predicted_dict = x.get_formatted_predicted_values(predictions, target_column)
        print("**predicted_dict**", predicted_dict)

        data = {"accuracy": accuracy, "predicted_values": {}}
        actual_values_dict = y_test.value_counts(dropna=False).to_dict()
        data["actual_values"] = actual_values_dict
        for key, value in predicted_dict.items():
            data["predicted_values"][key[0]] = value
        print("DATA", data)
        return JsonResponse({"data": data})
    return render(request, "naive_bayes/naive_bayes_custom.html")
