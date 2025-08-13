from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
import uuid

class User(AbstractUser):
    email = models.EmailField(_('email address'), unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    account_number = models.CharField(max_length=12, unique=True, editable=False)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name=_('groups'),
        blank=True,
        help_text=_(
            'The groups this user belongs to. A user will get all permissions '
            'granted to each of their groups.'
        ),
        related_name='custom_user_set',
        related_query_name='custom_user',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name=_('user permissions'),
        blank=True,
        help_text=_('Specific permissions for this user.'),
        related_name='custom_user_set',
        related_query_name='custom_user',
    )
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        if not self.account_number:
            self.account_number = str(uuid.uuid4().int)[:12]  # 12-digit unique number
        super().save(*args, **kwargs)

class OTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    
    def __str__(self):
        return f"{self.user.email} - {self.otp}"


class Blog(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blogs')
    title = models.CharField(max_length=200)
    content = models.TextField()
    image = models.ImageField(upload_to='blog_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} by {self.author.email}"


class Transaction(models.Model):
    TYPE_CHOICES = (
        ('DEPOSIT', 'Deposit'),
        ('TRANSFER', 'Transfer'),
        ('LOAN', 'Loan'),
    )
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    from_user = models.ForeignKey(User, null=True, blank=True, related_name='transactions_sent', on_delete=models.SET_NULL)
    to_user = models.ForeignKey(User, null=True, blank=True, related_name='transactions_received', on_delete=models.SET_NULL)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.type == 'DEPOSIT':
            return f"Deposit {self.amount} to {self.to_user.email if self.to_user else 'unknown'}"
        return f"Transfer {self.amount} from {self.from_user.email if self.from_user else 'unknown'} to {self.to_user.email if self.to_user else 'unknown'}"


class Comment(models.Model):
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')

    def __str__(self):
        return f"Comment by {self.author.email} on {self.blog.title}"


class Loan(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    )

    applicant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='loans')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    term_months = models.IntegerField()
    purpose = models.TextField(blank=True)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=10.00)  # percent per annum
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(blank=True, null=True)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_loans')

    def __str__(self):
        return f"Loan {self.id} - {self.applicant.email} - {self.status}"