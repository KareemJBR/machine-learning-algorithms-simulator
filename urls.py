from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('dfs/', views.dfs_home, name='dfs_home'),
    path('kmeans/', views.kmeans_home, name='kmeans_home'),
    path('knn/', views.knn_home, name='knn_home'),
    path('lda/', views.lda_home, name='lda_home'),
    path('mle/', views.mle_home, name='mle_home'),
    path('naive_bayes/', views.naive_bayes_home, name='naive_bayes_home'),
    path('pca/', views.pca_home, name='pca_home'),
    path('svm/', views.svm_home, name='svm_home')
]
