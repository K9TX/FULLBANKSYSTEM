from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, LoginView, PasswordResetRequestView,
    VerifyOTPView, ChangePasswordView, TransferMoneyView, DepositMoneyView,
    BalanceView, BlogListCreateView, UsersListView, TransactionsView, BlogCommentsView, MeView, ResolveAccountView,
    LoanListCreateView, LoanApproveRejectView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('password-reset/request/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset/verify/', VerifyOTPView.as_view(), name='verify_otp'),
    path('password/change/', ChangePasswordView.as_view(), name='change_password'),
    path('transfer/', TransferMoneyView.as_view(), name='transfer-money'),
    path('deposit/', DepositMoneyView.as_view(), name='deposit-money'),
    path('balance/', BalanceView.as_view(), name='balance'),
    path('me/', MeView.as_view(), name='me'),
    path('blogs/', BlogListCreateView.as_view(), name='blogs'),
    path('blogs/<int:blog_id>/comments/', BlogCommentsView.as_view(), name='blog-comments'),
    path('users/', UsersListView.as_view(), name='users'),
    path('transactions/', TransactionsView.as_view(), name='transactions'),
    path('resolve-account/', ResolveAccountView.as_view(), name='resolve-account'),
    path('loans/', LoanListCreateView.as_view(), name='loans'),
    path('loans/<int:loan_id>/action/', LoanApproveRejectView.as_view(), name='loan-action'),
]