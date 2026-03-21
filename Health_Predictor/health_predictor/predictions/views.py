from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import HealthPrediction
from .serializers import HealthPredictionInputSerializer, HealthPredictionSerializer
from .utils import predict_health_risk, generate_prescription
from doctors.models import DoctorProfile

class HealthPredictionView(generics.GenericAPIView):
    """
    Make health risk prediction using ML model
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = HealthPredictionInputSerializer
    
    def post(self, request, *args, **kwargs):
        # Check if user is patient
        if request.user.user_type != 'patient':
            return Response(
                {'error': 'Only patients can make predictions'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Validate input using serializer
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        
        try:
            # Make prediction using model
            prediction_result = predict_health_risk(data)
            risk_level = prediction_result['risk_level']
            risk_score = prediction_result.get('risk_score')
            
            # Generate prescription
            prescription = generate_prescription(risk_level, data)
            
            # # Find recommended doctor for high risk
            recommended_doctor = None
            if risk_level == 'high':
                recommended_doctor = DoctorProfile.objects.filter(
                    is_available=True
                ).first()
            
            # Save prediction to database
            health_prediction = HealthPrediction.objects.create(
                user=request.user,
                age=data['age'],
                gender=data['gender'],
                weight=data['weight'],
                height=data['height'],
                temperature=data['temperature'],
                blood_pressure=data['blood_pressure'],
                sleep=data['sleep'],
                heart_rate=data['heart_rate'],
                smoking=bool(data['smoking']),
                alcohol=bool(data['alcohol']),
                risk_level=risk_level,
                risk_score=risk_score,
                prescription=prescription
            )
            
            # # Prepare response
            response_data = {
                # 'prediction_id': health_prediction.id,
                'risk_level': risk_level,
                'prescription': prescription,
                'message': 'Health prediction completed successfully'
            }
            
            # # Add doctor recommendation for high risk
            if risk_level == 'high' and recommended_doctor:
                response_data['recommended_doctor'] = {
                    'id': recommended_doctor.id,
                    'name': recommended_doctor.user.get_full_name() or recommended_doctor.user.username,
                    'specialization': recommended_doctor.specialization,
                    'hospital': recommended_doctor.hospital_name,
                    'fee': str(recommended_doctor.consultation_fee)
                }
            
            # Return prediction response
            return Response(response_data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'error': f'Prediction failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PredictionHistoryView(generics.ListAPIView):
    """
    Get prediction history for logged-in patient
    """
    serializer_class = HealthPredictionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.user_type == 'patient':
            return HealthPrediction.objects.filter(
                user=self.request.user
            ).order_by('-created_at')
        return HealthPrediction.objects.none()


class PredictionDetailView(generics.RetrieveAPIView):
    """
    Get specific prediction details
    """
    serializer_class = HealthPredictionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.user_type == 'patient':
            return HealthPrediction.objects.filter(user=self.request.user)
        return HealthPrediction.objects.none()