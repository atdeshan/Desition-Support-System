from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    phoneNumber = models.CharField(max_length=20, null=True, blank=True)
    position = models.CharField(max_length=20, null=True, blank=True)

    def __str__(self):
        return self.username
class File(models.Model):
    file = models.FileField(upload_to='',blank=False, null=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} - {self.file.name}"

