from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("dfs/", views.dfs, name="dfs"),
    path("kmeans/", views.kmeans, name="kmeans"),
    path("knn/", views.knn, name="knn"),
    path("lda/", views.lda, name="lda"),
    path("mle/", views.mle, name="mle"),
    path("naive_bayes/", views.naive_bayes, name="naive_bayes"),
    path("pca/", views.pca, name="pca"),
    path("svm/", views.svm, name="svm"),
]
