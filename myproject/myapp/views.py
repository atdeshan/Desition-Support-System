from django.shortcuts import render
from rest_framework import generics,status
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os
from django.conf import settings
import csv  # Assuming the file is a CSV, change based on your file type
import pandas as pd


from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer, UserSerializer, FileSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.decorators import login_required
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

@permission_classes([IsAuthenticated])
@csrf_exempt  # Disable CSRF for testing, enable it in production
def upload_file(request):
    if request.method == 'POST' and request.FILES.get('file'):
        uploaded_file = request.FILES['file']
        file_path = os.path.join(settings.MEDIA_ROOT, uploaded_file.name)
        try:
            with open(file_path, 'wb+') as destination:
                for chunk in uploaded_file.chunks():
                    destination.write(chunk)
            serializer = FileSerializer(data={'file': uploaded_file, 'user': 1})
            if serializer.is_valid():
                serializer.save()
                print(request.user.id)
            else:
                print(serializer.errors)
                return JsonResponse(serializer.errors, status=400)
            return JsonResponse({'message': 'File uploaded successfully'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

        

    return JsonResponse({'error': 'No file uploaded'}, status=400)

def product_sales(request):
    try:    
            file_path = os.path.join(settings.MEDIA_ROOT, 'gg.csv')
            # Example: Process CSV file
            with open(file_path, 'r') as file:
                sales_data = pd.read_csv(file)
                sales_data["Date"] = pd.to_datetime(sales_data["Date"])
                daily_sales = sales_data.groupby(['Product Name']).agg({'Total Sale': 'sum'}).reset_index()
                sales_data['Discount'] = sales_data['Discount'].fillna(0)
                sales_upon_to_discount = sales_data.groupby(['Product Name']).agg({'Discount': 'first', 'Total Sale': 'sum'}).reset_index()
                # print(sales_upon_to_discount.head())
                sales_by_discount = sales_data.groupby(['Discount']).agg({'Total Sale': 'sum'}).reset_index()
                sales_accordingto_branch = sales_data.groupby(['Branch']).agg({'Total Sale': 'sum'}).reset_index()
                
                descriptionsales_data=sales_data[["Total Sale"]].describe().reset_index()

                print(descriptionsales_data)

                    
                

                # Combine all data into a response
                response_data = {'daily_sales': daily_sales.to_dict(orient='records'),'sales_upon_to_discount': sales_upon_to_discount.to_dict(orient='records'),'sales_by_discount': sales_by_discount.to_dict(orient='records'),'sales_accordingto_branch': sales_accordingto_branch.to_dict(orient='records'),'descriptionsales_data': descriptionsales_data.to_dict(orient='records')}
                # response_data = {'daily_sales': daily_sales.to_dict(orient='records'),'sales_upon_to_discount': sales_upon_to_discount.to_dict(orient='records')}
                
                return JsonResponse(response_data, safe=False)
                
          
            

            return JsonResponse({'message': 'File uploaded and processed successfully'})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    finally:
        pass
class RegisterView(APIView):
    print("hello")
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": UserSerializer(user).data,
            })
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)