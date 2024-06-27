from rest_framework import serializers
from login.models import CourseDiary,Chats

class LoginSerializer(serializers.Serializer):
    username=serializers.CharField()
    password=serializers.CharField()
    user_type=serializers.CharField()
    print('data serialized')

class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chats
        fields = ['subject', 'sender_id', 'message', 'time']
