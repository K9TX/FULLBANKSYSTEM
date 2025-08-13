from datetime import datetime, timedelta
import random
from rest_framework import status, generics
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.core.mail import send_mail, EmailMultiAlternatives
from django.conf import settings
from .serializers import (
    UserSerializer, LoginSerializer, PasswordResetRequestSerializer,
    OTPVerificationSerializer, ChangePasswordSerializer, DepositSerializer,
    BalanceSerializer, BlogSerializer, TransactionSerializer, NestedCommentSerializer, CommentCreateSerializer,
    ProfileUpdateSerializer, LoanSerializer
)
from .models import User, OTP, Blog, Transaction, Comment, Loan
from decimal import Decimal, InvalidOperation
from django.db import models, transaction
from django.db.models import F

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        try:
            self._send_welcome_email(user)
        except Exception:
            # Do not interrupt registration flow if email fails in development
            pass

    def _send_welcome_email(self, user: User):
        subject = 'Welcome to K9TX Bank'
        preheader = 'Thank you for creating your account with K9TX Bank.'
        title = 'Welcome Aboard'
        body_lines = [
            f"Hi {user.username or user.email},",
            'Your new digital banking experience starts now.',
            'We focus on security, speed and a delightful interface to make money simple.',
        ]

        text_content = f"{title}\n\n" + "\n".join(body_lines)
        html_lines = ''.join(f'<p style="margin:6px 0;color:#bcd3ff;">{line}</p>' for line in body_lines)
        html_content = f"""
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #0b1020; padding: 30px; color: #eaf2ff;">
            <div style="max-width: 560px; margin: auto; background: #0f1a38; border-radius: 10px; box-shadow: 0 0 24px rgba(45,127,249,0.25); padding: 28px; border: 1px solid rgba(45,127,249,0.25);">
              <span style="display:none;visibility:hidden;opacity:0;height:0;width:0">{preheader}</span>
              <h2 style="color: #eaf2ff; text-align: center; margin-top: 0;">K9TX Bank</h2>
              <div style="text-align:center;margin:14px 0 20px 0;">
                <span style="display:inline-block;background:#2d7ff9;color:#fff;font-size:16px;letter-spacing:1px;padding:8px 16px;border-radius:6px;font-weight:800;box-shadow:0 0 12px rgba(45,127,249,0.45);">{title}</span>
              </div>
              {html_lines}
              <hr style="border:none;border-top:1px solid rgba(255,255,255,0.12);margin: 20px 0;" />
              <p style="font-size:12px;color:#9fb4ff;text-align:center;margin:0;">We're glad you're here. If you did not sign up, please ignore this email.</p>
            </div>
          </body>
        </html>
        """
        email_message = EmailMultiAlternatives(
            subject,
            text_content,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
        )
        email_message.attach_alternative(html_content, "text/html")
        email_message.send(fail_silently=True)

class LoginView(APIView):
    permission_classes = (AllowAny,)
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(email=email, password=password)
            
            if user:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': UserSerializer(user).data
                })
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetRequestView(APIView):
    permission_classes = (AllowAny,)
    
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = User.objects.get(email=email)
                otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
                expires_at = datetime.now() + timedelta(minutes=10)
                
                OTP.objects.create(
                    user=user,
                    otp=otp,
                    expires_at=expires_at
                )
                
                # Send OTP via email with HTML template
                subject = 'K9TX Capital Management - Password Reset OTP'
                text_content = f'Your OTP for password reset is: {otp}. Valid for 10 minutes.'
                html_content = f"""
                <html>
                  <body style="font-family: Arial, sans-serif; background-color: #0b1020; padding: 30px; color: #eaf2ff;">
                    <div style="max-width: 560px; margin: auto; background: #0f1a38; border-radius: 10px; box-shadow: 0 0 24px rgba(45,127,249,0.25); padding: 28px; border: 1px solid rgba(45,127,249,0.25);">
                      <h2 style="color: #eaf2ff; text-align: center; margin-top: 0;">K9TX Capital Management</h2>
                      <p>Dear {user.username or 'user'},</p>
                      <p>You requested to reset your password. Please use the OTP below to proceed:</p>
                      <div style="text-align: center; margin: 24px 0;">
                        <span style="display: inline-block; background: #2d7ff9; color: #fff; font-size: 28px; letter-spacing: 8px; padding: 12px 24px; border-radius: 8px; font-weight: 800;">
                          {otp}
                        </span>
                      </div>
                      <p style="color: #9fb4ff;">This OTP is valid for 10 minutes.</p>
                      <p>If you did not request this, please ignore this email.</p>
                      <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.12); margin: 24px 0;">
                      <p style="font-size: 12px; color: #9fb4ff; text-align: center; margin: 0;">&copy; {datetime.now().year} K9TX Capital Management. All rights reserved.</p>
                    </div>
                  </body>
                </html>
                """

                email_message = EmailMultiAlternatives(
                    subject,
                    text_content,
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                )
                email_message.attach_alternative(html_content, "text/html")
                email_message.send(fail_silently=False)
                
                return Response({'message': 'OTP sent successfully to your email'})
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPView(APIView):
    permission_classes = (AllowAny,)
    
    def post(self, request):
        serializer = OTPVerificationSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp_code = serializer.validated_data['otp']
            new_password = serializer.validated_data['new_password']
            
            try:
                user = User.objects.get(email=email)
                otp = OTP.objects.filter(
                    user=user,
                    otp=otp_code,
                    expires_at__gt=datetime.now()
                ).latest('created_at')
                
                user.set_password(new_password)
                user.save()
                otp.delete()
                
                return Response({'message': 'Password reset successful'})
            except (User.DoesNotExist, OTP.DoesNotExist):
                return Response({'error': 'Invalid OTP or user'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(APIView):
    permission_classes = (IsAuthenticated,)
    
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if user.check_password(serializer.validated_data['old_password']):
                user.set_password(serializer.validated_data['new_password'])
                user.save()
                return Response({'message': 'Password changed successfully'})
            return Response({'error': 'Invalid old password'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TransferMoneyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        from_user = request.user
        to_account_number = request.data.get('to_account_number')
        amount = request.data.get('amount')

        if not to_account_number or amount is None:
            return Response({'error': 'Account number and amount required.'}, status=400)

        try:
            amount = Decimal(str(amount))
            if amount <= 0:
                raise InvalidOperation
        except (InvalidOperation, ValueError):
            return Response({'error': 'Invalid amount.'}, status=400)

        try:
            to_user = User.objects.get(account_number=to_account_number)
        except User.DoesNotExist:
            return Response({'error': 'Recipient not found.'}, status=404)

        if to_user.id == from_user.id:
            return Response({'error': 'Cannot transfer to your own account.'}, status=400)

        if from_user.balance < amount:
            return Response({'error': 'Insufficient balance.'}, status=400)

        # Atomic transfer to avoid partial updates
        with transaction.atomic():
            # Lock rows for update to avoid race conditions
            sender = User.objects.select_for_update().get(id=from_user.id)
            receiver = User.objects.select_for_update().get(id=to_user.id)

            if sender.balance < amount:
                return Response({'error': 'Insufficient balance.'}, status=400)

            User.objects.filter(id=sender.id).update(balance=F('balance') - amount)
            User.objects.filter(id=receiver.id).update(balance=F('balance') + amount)

            tx = Transaction.objects.create(type='TRANSFER', from_user=sender, to_user=receiver, amount=amount)

        # Send notification emails (best-effort; do not block response on failure)
        try:
            self._send_transfer_email_notifications(sender, receiver, amount, tx)
        except Exception:
            # Silently ignore email failures in dev
            pass

        return Response({'success': f'Transferred {amount} to {to_user.username}.'})

    def _send_transfer_email_notifications(self, sender: User, receiver: User, amount, tx: Transaction):
        sent_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        def send_html_email(to_email: str, subject: str, preheader: str, title: str, body_lines: list[str]):
            text_content = f"{title}\n" + "\n".join(body_lines)
            html_lines = ''.join(f'<p style="margin:6px 0;color:#bcd3ff;">{line}</p>' for line in body_lines)
            html_content = f"""
            <html>
              <body style="font-family: Arial, sans-serif; background-color: #0b1020; padding: 30px; color: #eaf2ff;">
                <div style="max-width: 560px; margin: auto; background: #0f1a38; border-radius: 10px; box-shadow: 0 0 24px rgba(45,127,249,0.25); padding: 28px; border: 1px solid rgba(45,127,249,0.25);">
                  <span style="display:none;visibility:hidden;opacity:0;height:0;width:0">{preheader}</span>
                  <h2 style="color: #eaf2ff; text-align: center; margin-top: 0;">K9TX Bank</h2>
                  <div style="text-align:center;margin:14px 0 20px 0;">
                    <span style="display:inline-block;background:#2d7ff9;color:#fff;font-size:16px;letter-spacing:1px;padding:8px 16px;border-radius:6px;font-weight:800;box-shadow:0 0 12px rgba(45,127,249,0.45);">{title}</span>
                  </div>
                  {html_lines}
                  <hr style="border:none;border-top:1px solid rgba(255,255,255,0.12);margin: 20px 0;" />
                  <p style="font-size:12px;color:#9fb4ff;text-align:center;margin:0;">This is an automated message – please do not reply.</p>
                </div>
              </body>
            </html>
            """
            email_message = EmailMultiAlternatives(
                subject,
                text_content,
                settings.DEFAULT_FROM_EMAIL,
                [to_email],
            )
            email_message.attach_alternative(html_content, "text/html")
            email_message.send(fail_silently=True)

        # Sender email
        send_html_email(
            to_email=sender.email,
            subject="Transfer Money confirmation",
            preheader=f"You sent ₹{amount} to {receiver.username}",
            title="Money Sent",
            body_lines=[
                f"Amount: ₹{amount}",
                f"To: {receiver.username} ({receiver.email})",
                f"When: {sent_at}",
                f"Transaction ID: {tx.id}",
            ],
        )

        # Receiver email
        send_html_email(
            to_email=receiver.email,
            subject="You received a Money",
            preheader=f"You received ₹{amount} from {sender.username}",
            title="Money Received",
            body_lines=[
                f"Amount: ₹{amount}",
                f"From: {sender.username} ({sender.email})",
                f"When: {sent_at}",
                f"Transaction ID: {tx.id}",
            ],
        )

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)

    def put(self, request):
        serializer = ProfileUpdateSerializer(instance=request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(UserSerializer(request.user, context={'request': request}).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DepositMoneyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = DepositSerializer(data=request.data)
        if serializer.is_valid():
            amount = serializer.validated_data['amount']
            user = request.user
            user.balance += amount
            user.save()
            Transaction.objects.create(type='DEPOSIT', to_user=user, amount=amount)
            return Response({'success': f'Deposited {amount} successfully.', 'balance': str(user.balance)})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BalanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'balance': str(request.user.balance)})

class BlogListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        blogs = Blog.objects.select_related('author').order_by('-created_at')
        serializer = BlogSerializer(blogs, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        serializer = BlogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        # Admin-only deletion of a blog by id in query param or payload
        if not request.user.is_staff:
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        blog_id = request.query_params.get('id') or request.data.get('id')
        if not blog_id:
            return Response({'error': 'id is required'}, status=400)
        try:
            blog = Blog.objects.get(id=blog_id)
        except Blog.DoesNotExist:
            return Response({'error': 'Blog not found'}, status=404)
        blog.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class BlogCommentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, blog_id):
        try:
            blog = Blog.objects.get(id=blog_id)
        except Blog.DoesNotExist:
            return Response({'error': 'Blog not found'}, status=status.HTTP_404_NOT_FOUND)
        # top-level comments only, with nested replies
        comments = Comment.objects.filter(blog=blog, parent__isnull=True).select_related('author').order_by('created_at')
        data = NestedCommentSerializer(comments, many=True, context={'request': request}).data
        return Response(data)

    def post(self, request, blog_id):
        try:
            blog = Blog.objects.get(id=blog_id)
        except Blog.DoesNotExist:
            return Response({'error': 'Blog not found'}, status=status.HTTP_404_NOT_FOUND)
        payload = {**request.data, 'blog': blog.id}
        serializer = CommentCreateSerializer(data=payload)
        if serializer.is_valid():
            parent = serializer.validated_data.get('parent')
            if parent and parent.blog_id != blog.id:
                return Response({'error': 'Parent comment does not belong to this blog'}, status=400)
            comment = serializer.save(author=request.user)
            # Return full nested representation for the created comment (top-level or reply)
            return Response(NestedCommentSerializer(comment, context={'request': request}).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UsersListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        others = User.objects.exclude(id=request.user.id).values('username', 'email', 'account_number')
        return Response(list(others))

class TransactionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Transaction.objects.filter(models.Q(from_user=request.user) | models.Q(to_user=request.user)).order_by('-created_at')
        data = TransactionSerializer(qs, many=True).data
        return Response(data)


class ResolveAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        account_number = request.query_params.get('account_number')
        if not account_number:
            return Response({'error': 'account_number is required'}, status=400)
        try:
            user = User.objects.get(account_number=account_number)
            return Response({
                'account_number': user.account_number,
                'username': user.username,
                'email': user.email,
            })
        except User.DoesNotExist:
            return Response({'error': 'Account not found'}, status=404)


class LoanListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Admin sees all, user sees own
        if request.user.is_staff:
            loans = Loan.objects.select_related('applicant', 'approved_by').order_by('-created_at')
        else:
            loans = Loan.objects.filter(applicant=request.user).select_related('applicant', 'approved_by').order_by('-created_at')
        return Response(LoanSerializer(loans, many=True).data)

    def post(self, request):
        # Create loan application for current user
        serializer = LoanSerializer(data=request.data)
        if serializer.is_valid():
            loan = serializer.save(applicant=request.user, status='PENDING')
            return Response(LoanSerializer(loan).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=400)


class LoanApproveRejectView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, loan_id):
        # Admin approve
        if not request.user.is_staff:
            return Response({'error': 'Forbidden'}, status=403)
        action = request.data.get('action')
        if action not in ('approve', 'reject'):
            return Response({'error': 'action must be approve or reject'}, status=400)
        with transaction.atomic():
            try:
                loan = Loan.objects.select_for_update().get(id=loan_id)
            except Loan.DoesNotExist:
                return Response({'error': 'Loan not found'}, status=404)

            if loan.status != 'PENDING':
                return Response({'error': 'Loan already processed'}, status=400)

            if action == 'approve':
                loan.status = 'APPROVED'
                loan.approved_at = datetime.now()
                loan.approved_by = request.user
                loan.save()
                # Credit amount to applicant balance and record transaction
                applicant = User.objects.select_for_update().get(id=loan.applicant_id)
                User.objects.filter(id=applicant.id).update(balance=F('balance') + loan.amount)
                Transaction.objects.create(type='LOAN', to_user=applicant, amount=loan.amount)
            else:
                loan.status = 'REJECTED'
                loan.approved_at = datetime.now()
                loan.approved_by = request.user
                loan.save()

        return Response(LoanSerializer(loan).data)
