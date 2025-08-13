from decimal import Decimal
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import OTP, User, Blog, Transaction, Comment, Loan

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    profile_image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'password', 'password2', 'phone_number',
            'account_number', 'balance', 'profile_image', 'profile_image_url', 'is_staff'
        )
        extra_kwargs = {
            'email': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user

    def get_profile_image_url(self, obj):
        request = self.context.get('request')
        if obj.profile_image and hasattr(obj.profile_image, 'url'):
            url = obj.profile_image.url
            try:
                modified = obj.profile_image.storage.get_modified_time(obj.profile_image.name)
                version = int(modified.timestamp()) if modified else None
            except Exception:
                version = None
            full_url = request.build_absolute_uri(url) if request is not None else url
            if version:
                sep = '&' if '?' in full_url else '?'
                return f"{full_url}{sep}v={version}"
            return full_url
        return None


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'phone_number', 'profile_image')

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True)

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

class OTPVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    otp = serializers.CharField(required=True, max_length=6)
    new_password = serializers.CharField(required=True, validators=[validate_password])

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])


class DepositSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=Decimal('0.01'))


class BalanceSerializer(serializers.Serializer):
    balance = serializers.DecimalField(max_digits=12, decimal_places=2)


class BlogSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    author_profile_image_url = serializers.SerializerMethodField(read_only=True)
    image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Blog
        fields = ['id', 'author', 'author_username', 'author_profile_image_url', 'title', 'content', 'image', 'image_url', 'created_at']
        read_only_fields = ['author', 'created_at']

    def get_author_profile_image_url(self, obj):
        image = getattr(obj.author, 'profile_image', None)
        if image and hasattr(image, 'url'):
            request = self.context.get('request')
            url = image.url
            try:
                modified = image.storage.get_modified_time(image.name)
                version = int(modified.timestamp()) if modified else None
            except Exception:
                version = None
            full_url = request.build_absolute_uri(url) if request is not None else url
            if version:
                sep = '&' if '?' in full_url else '?'
                return f"{full_url}{sep}v={version}"
            return full_url
        return None

    def get_image_url(self, obj):
        image = getattr(obj, 'image', None)
        if image and hasattr(image, 'url'):
            # Return relative path (e.g., /media/...) to avoid mixed content and allow Vite proxying
            return image.url
        return None


class ChildCommentSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    author_profile_image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'author', 'author_username', 'author_profile_image_url', 'content', 'created_at', 'parent']
        read_only_fields = ['author', 'created_at']

    def get_author_profile_image_url(self, obj):
        image = getattr(obj.author, 'profile_image', None)
        if image and hasattr(image, 'url'):
            request = self.context.get('request')
            url = image.url
            try:
                modified = image.storage.get_modified_time(image.name)
                version = int(modified.timestamp()) if modified else None
            except Exception:
                version = None
            full_url = request.build_absolute_uri(url) if request is not None else url
            if version:
                sep = '&' if '?' in full_url else '?'
                return f"{full_url}{sep}v={version}"
            return full_url
        return None


class NestedCommentSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    replies = serializers.SerializerMethodField()
    author_profile_image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'author', 'author_username', 'author_profile_image_url', 'content', 'created_at', 'parent', 'replies']
        read_only_fields = ['author', 'created_at', 'replies']

    def get_replies(self, obj):
        # Only one-level nesting to keep payload small
        replies_qs = obj.replies.select_related('author').order_by('created_at')
        return ChildCommentSerializer(replies_qs, many=True, context=self.context).data

    def get_author_profile_image_url(self, obj):
        image = getattr(obj.author, 'profile_image', None)
        if image and hasattr(image, 'url'):
            request = self.context.get('request')
            url = image.url
            try:
                modified = image.storage.get_modified_time(image.name)
                version = int(modified.timestamp()) if modified else None
            except Exception:
                version = None
            full_url = request.build_absolute_uri(url) if request is not None else url
            if version:
                sep = '&' if '?' in full_url else '?'
                return f"{full_url}{sep}v={version}"
            return full_url
        return None


class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'blog', 'content', 'parent']
        extra_kwargs = {
            'blog': {'write_only': True},
            'parent': {'required': False, 'allow_null': True},
        }

class TransactionSerializer(serializers.ModelSerializer):
    from_username = serializers.SerializerMethodField()
    to_username = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = ['id', 'type', 'from_user', 'to_user', 'from_username', 'to_username', 'amount', 'created_at']

    def get_from_username(self, obj):
        return getattr(obj.from_user, 'username', None)

    def get_to_username(self, obj):
        return getattr(obj.to_user, 'username', None)


class LoanSerializer(serializers.ModelSerializer):
    applicant_username = serializers.CharField(source='applicant.username', read_only=True)

    class Meta:
        model = Loan
        fields = [
            'id', 'applicant', 'applicant_username', 'amount', 'term_months', 'purpose', 'interest_rate',
            'status', 'created_at', 'approved_at', 'approved_by'
        ]
        read_only_fields = ['status', 'created_at', 'approved_at', 'approved_by', 'applicant']