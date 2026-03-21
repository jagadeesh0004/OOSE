from rest_framework import serializers
from .models import HealthPrediction

class HealthPredictionInputSerializer(serializers.Serializer):
    """Serializer for validating prediction input"""
    age = serializers.IntegerField(min_value=1, max_value=120)
    gender = serializers.ChoiceField(choices=['male', 'female'])
    weight = serializers.FloatField(min_value=20, max_value=300)
    height = serializers.FloatField(min_value=50, max_value=250)
    temperature = serializers.FloatField(min_value=35, max_value=42)  # Celsius
    blood_pressure = serializers.FloatField(min_value=50, max_value=250)
    sleep = serializers.FloatField(min_value=0, max_value=24)
    heart_rate = serializers.IntegerField(min_value=30, max_value=200)
    smoking = serializers.ChoiceField(choices=['yes', 'no'])
    alcohol = serializers.ChoiceField(choices=['yes', 'no'])

class HealthPredictionSerializer(serializers.ModelSerializer):
    """Serializer for prediction output"""
    class Meta:
        model = HealthPrediction
        fields = '__all__'
        read_only_fields = ['user', 'risk_level', 'risk_score', 'prescription', 'created_at']