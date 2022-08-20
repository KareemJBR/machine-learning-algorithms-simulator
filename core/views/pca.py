import json

import numpy as np
import pandas as pd
from django.contrib import messages
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from pandas.core.frame import DataFrame
import plotly.express as px
from sklearn.decomposition import PCA

from core.utils import upload_file
from setup.settings import TEMPORARY_FILE_DIR


@csrf_exempt
def choose_pca(request):
    return render(request, "pca/choose_pca.html")


@csrf_exempt
def pca(request):
    if request.method == "POST":
        output_dict = json.loads(request.body)
        n_components: int = int(output_dict["n_components"])
        df = px.data.iris()
        features = ["sepal_length", "sepal_width", "petal_length", "petal_width"]
        X = df[features]

        pca = PCA(n_components=n_components)
        components = pca.fit_transform(X)

        if n_components == 2:
            loadings = pca.components_.T * np.sqrt(pca.explained_variance_)
            fig = px.scatter(components, x=0, y=1, color=df["species"])
            for i, feature in enumerate(features):
                fig.add_shape(
                    type="line", x0=0, y0=0, x1=loadings[i, 0], y1=loadings[i, 1]
                )
                fig.add_annotation(
                    x=loadings[i, 0],
                    y=loadings[i, 1],
                    ax=0,
                    ay=0,
                    xanchor="center",
                    yanchor="bottom",
                    text=feature,
                )
            fig.show()

        if n_components == 3:
            total_var = pca.explained_variance_ratio_.sum() * 100
            fig = px.scatter_3d(
                components,
                x=0,
                y=1,
                z=2,
                color=df["species"],
                title=f"Total Explained Variance: {total_var:.2f}%",
                labels={"0": "PC 1", "1": "PC 2", "2": "PC 3"},
            )
            fig.show()

    return render(request, "pca/pca_home.html")


@csrf_exempt
def pca_custom(request):
    if request.method == "POST":
        df = upload_file(request)
        column_headers = list(df.columns)
        if len(column_headers) > 0:
            return render(
                request,
                "pca/pca_custom.html",
                {"column_headers": column_headers},
            )
    if request.method == "PUT":
        output_dict = json.loads(request.body)
        n_components = output_dict["n_components"]
        print("n_components: ", type(n_components))

        df: DataFrame = pd.read_csv(f"{TEMPORARY_FILE_DIR}/user_file.csv", sep=",")
        features = list(df.columns)

        print("Features", features)
        print("DF", df)

        if n_components == 3 and len(features) <= 2:
            messages.error(request, "File should contains at least 3 columns.")

        X = df
        pca = PCA(n_components=n_components)
        components = pca.fit_transform(X)

        if n_components == 2:
            loadings = pca.components_.T * np.sqrt(pca.explained_variance_)

            fig = px.scatter(components, x=0, y=1)

            for i, feature in enumerate(features):
                fig.add_shape(
                    type="line", x0=0, y0=0, x1=loadings[i, 0], y1=loadings[i, 1]
                )
                fig.add_annotation(
                    x=loadings[i, 0],
                    y=loadings[i, 1],
                    ax=0,
                    ay=0,
                    xanchor="center",
                    yanchor="bottom",
                    text=feature,
                )
            fig.show()

        if n_components == 3:
            total_var = pca.explained_variance_ratio_.sum() * 100
            fig = px.scatter_3d(
                components,
                x=0,
                y=1,
                z=2,
                title=f"Total Explained Variance: {total_var:.2f}%",
                labels={"0": "PC 1", "1": "PC 2", "2": "PC 3"},
            )
            fig.show()

    return render(request, "pca/pca_custom.html")
