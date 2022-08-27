import base64
import json
from io import BytesIO
import math

import logging
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import scipy
import scipy.stats
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from core.utils import upload_file
from setup.settings import TEMPORARY_FILE_DIR

plt.switch_backend("agg")


@csrf_exempt
def choose_mle(request):
    return render(request, "mle/choose_mle.html")


@csrf_exempt
def mle(request):
    if request.method == "POST":
        plt.close("all")
        output_dict = json.loads(request.body)
        mean_val, std_val = float(output_dict["mean"]), float(output_dict["std"])
        X = np.random.normal(mean_val, std_val, 1000)
        mu, std = scipy.stats.norm.fit(X)
        pdf = scipy.stats.norm.pdf
        x = np.linspace(0, 80, 80)
        plt.hist(X, bins=x, density="true")
        plt.plot(pdf(x, loc=mu, scale=std))
        plt.xlabel("Value")
        plt.ylabel("Frequency")
        plt.legend(
            [
                "Fitted Distribution",
                "Observed Data",
            ]
        )
        buffer = BytesIO()
        plt.savefig(buffer, format="png")
        buffer.seek(0)
        image_png = buffer.getvalue()
        buffer.close()

        image = base64.b64encode(image_png)
        image = image.decode("utf-8")
        return JsonResponse({"image": image})

    return render(request, "mle/mle_home.html")


@csrf_exempt
def mle_custom(request):
    if request.method == "POST":
        df = upload_file(request)
        column_headers = list(df.columns)
        if len(column_headers) > 0:
            return render(
                request,
                "mle/mle_custom.html",
                {"column_headers": column_headers},
            )
    if request.method == "PUT":
        try:
            plt.close("all")
            df = pd.read_csv(f"{TEMPORARY_FILE_DIR}/user_file.csv", sep=",")
            output_dict = json.loads(request.body)
            target_column = output_dict["target_column"]
            X_column = df[target_column]
            min_num = math.floor(X_column.min())
            max_num = math.ceil(X_column.max())
            mean = scipy.mean([X_column])
            std_val = np.std([X_column])
            mu, std = scipy.stats.norm.fit(X_column)
            pdf = scipy.stats.norm.pdf
            x = np.linspace(min_num, max_num, max_num + 10)
            plt.hist(X_column, bins=x, density="true")
            plt.plot(pdf(x, loc=mu, scale=std))
            plt.xlabel("Value")
            plt.ylabel("Frequency")
            plt.legend(
                [
                    "Fitted Distribution",
                    "Observed Data",
                ]
            )
            buffer = BytesIO()
            plt.savefig(buffer, format="png")
            buffer.seek(0)
            image_png = buffer.getvalue()
            buffer.close()
            image = base64.b64encode(image_png)
            image = image.decode("utf-8")
            return JsonResponse(
                {"image": image, "mean": round(mean, 2), "std": round(std_val, 2)}
            )
        except Exception as e:
            logging.getLogger("error_logger").error("Error: " + repr(e))
            return JsonResponse(
                {
                    "error": "The column you selected as the target does not meet the requirements. Please select another column or upload a new dataset."
                }
            )
    return render(request, "mle/mle_custom.html")
