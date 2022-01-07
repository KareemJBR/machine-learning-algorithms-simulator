"""mysite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
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
