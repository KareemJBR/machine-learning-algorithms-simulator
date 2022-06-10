import base64
import json
from io import BytesIO
import matplotlib.pyplot as plt
import numpy as np
import scipy
import scipy.stats
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt


plt.switch_backend("agg")


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

    return render(request, "mle_home.html")
