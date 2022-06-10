import pandas as pd
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from core.algorithms import NaiveBayes


@csrf_exempt
def naive_bayes(request):

    if request.method == "POST":
        # upload Iris dataset -  shape is (150, 5)
        df = pd.read_csv(
            "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv"
        )
        # shuffle dataset with sample
        df = df.sample(frac=1, random_state=1).reset_index(drop=True)
        # set features and target
        x, y = df.iloc[:, :-1], df.iloc[:, -1]
        # # split on train and test (0.7|0.3)
        x_train, x_test, y_train, y_test = x[:100], x[100:], y[:100], y[100:]
        x = NaiveBayes()
        x.fit(x_train, y_train)
        predictions = x.predict(x_test)
        accuracy = x.accuracy(y_test, predictions)
        (
            predicted_versicolor,
            predicted_setosa,
            predicted_virginica,
        ) = x.get_formatted_predicted_values(predictions, "Species")
        data = {
            "versicolor": predicted_versicolor,
            "setosa": predicted_setosa,
            "virginica": predicted_virginica,
            "accuracy": accuracy,
        }
        return JsonResponse({"data": data})

    return render(request, "naive_bayes_home.html")
