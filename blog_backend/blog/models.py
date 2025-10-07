from django.db import models
from django.conf import settings
from ckeditor.fields import RichTextField

User = settings.AUTH_USER_MODEL

class CategoryChoices(models.TextChoices):
    TECHNOLOGY = 'Technology', 'Technology'
    LIFESTYLE = 'Lifestyle', 'Lifestyle'
    EDUCATION = 'Education', 'Education'
    HEALTH = 'Health', 'Health'
    TRAVEL = 'Travel', 'Travel'

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=200)
    content = RichTextField()
    cover_image = models.ImageField(
        upload_to='post_covers/', null=True, blank=True
    )
    category = models.CharField(max_length=10, choices=CategoryChoices.choices, default=CategoryChoices.TECHNOLOGY)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f'Comment by {self.author} on {self.post}'
