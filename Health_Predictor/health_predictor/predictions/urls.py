from django.urls import path
from . import views

urlpatterns = [
    path('predict/', views.HealthPredictionView.as_view(), name='predict'),
    path('history/', views.PredictionHistoryView.as_view(), name='prediction-history'),
    path('<int:pk>/', views.PredictionDetailView.as_view(), name='prediction-detail'),
]
