import json
import numpy as np
import plotly.express as px
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from sklearn.decomposition import PCA


@csrf_exempt
def pca(request):
    if request.method == "POST":
        output_dict = json.loads(request.body)
        n_components = int(output_dict["n_components"])
        df = px.data.iris()
        features = ["sepal_length", "sepal_width", "petal_length", "petal_width"]
        x = df[features]

        pca_alg = PCA(n_components=n_components)
        components = pca_alg.fit_transform(x)

        if n_components == 2:
            loadings = pca_alg.components_.T * np.sqrt(pca_alg.explained_variance_)

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
            total_var = pca_alg.explained_variance_ratio_.sum() * 100
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

    return render(request, "pca_home.html")
