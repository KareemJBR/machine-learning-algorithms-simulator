import json

import numpy as np
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from sklearn import preprocessing

from core.algorithms import SVM


@csrf_exempt
def svm(request):
    if request.method == "POST":
        output_dict = json.loads(request.body)
        X, y = np.array(output_dict["points_x"]), np.array(output_dict["points_y"])
        c = output_dict["c"]
        y[y == 0] = -1
        # scale the data
        scaler = preprocessing.StandardScaler()
        X = scaler.fit_transform(X)
        # now we'll use our custom implementation
        model = SVM(c)
        model.fit(X, y)
        data = model.plot()
        print("train score:", model.score(X, y))
        return JsonResponse({"data": data})
    return render(request, "svm_home.html")
