from rest_framework import serializers

class LoginSerializer(serializers.Serializer):
    username=serializers.CharField()
    password=serializers.CharField()
    user_type=serializers.CharField()
    print('data serialized')