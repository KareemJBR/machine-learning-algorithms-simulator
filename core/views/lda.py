import json
import numpy as np
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from sklearn.model_selection import train_test_split
from core.algorithms import LDA


@csrf_exempt
def lda(request):

    if request.method == "POST":
        output_dict = json.loads(request.body)
        x, y = np.array(output_dict["points_x"]), output_dict["points_y"]
        x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2)
        lda_object = LDA(n_components=2)
        response = lda_object.transform(x_train, y_train)
        return JsonResponse({"data": response})

    return render(request, "lda_home.html")
