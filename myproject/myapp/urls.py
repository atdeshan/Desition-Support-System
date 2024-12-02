from django.urls import path

from .views import upload_file
from .views import product_sales,RegisterView, LoginView


urlpatterns = [
  
    path('api/upload', upload_file, name='upload-file'),
    path('api/product_sales', product_sales, name='product-sales'),
    path('api/register', RegisterView.as_view(), name='register'),
    path('api/login', LoginView.as_view(), name='login'),
]