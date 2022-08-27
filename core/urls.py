from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("dfs/", views.dfs, name="dfs"),
    path("knn/", views.knn, name="knn"),
    path("kmeans/", views.kmeans, name="kmeans"),
    path("lda/", views.lda, name="lda"),
    path("mle/", views.mle, name="mle"),
    path("naive_bayes/", views.naive_bayes, name="naive_bayes"),
    path("pca/", views.pca, name="pca"),
    path("svm/", views.svm, name="svm"),
    path("choose_kmeans/", views.choose_kmeans, name="choose_kmeans"),
    path("choose_naive_bayes/", views.choose_naive_bayes, name="choose_naive_bayes"),
    path("choose_mle/", views.choose_mle, name="choose_mle"),
    path("choose_pca/", views.choose_pca, name="choose_pca"),
    path("choose_lda/", views.choose_lda, name="choose_lda"),
    path("custom_lda/", views.lda_custom, name="lda_custom"),
    path("custom_kmeans/", views.kmeans_custom, name="kmeans_custom"),
    path("custom_mle/", views.mle_custom, name="mle_custom"),
    path("custom_naive_bayes/", views.naive_bayes_custom, name="naive_bayes_custom"),
    path("custom_pca/", views.pca_custom, name="pca_custom"),
]
