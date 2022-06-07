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
        X, y = np.array(output_dict["points_x"]), output_dict["points_y"]
        X_train, X_test, Y_train, Y_test = train_test_split(X, y, test_size=0.2)
        LDA_object = LDA(n_components=2)
        response = LDA_object.transform(X_train, Y_train)
        return JsonResponse({"data": response})
    return render(request, "lda_home.html")
