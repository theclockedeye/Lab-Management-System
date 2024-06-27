from rest_framework import serializers
from login.models import Subject,CourseDiary

class CourseDiarySerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseDiary
        fields = ['date', 'vivamark']

class SubjectSerializer(serializers.ModelSerializer):
    coursediaries = CourseDiarySerializer(source='coursediary_set', many=True, read_only=True)

    class Meta:
        model = Subject
        fields = ['name', 'coursediaries']