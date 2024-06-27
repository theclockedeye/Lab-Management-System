# Create your views here.
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token
from django.views.decorators.cache import never_cache

from login.models import Student,CourseDiary

# views.py
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.forms import AuthenticationForm
from rest_framework.permissions import AllowAny
from .serializers import  LoginSerializer,ChatSerializer

from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from login.models import Student, Department, Class,Subject,Faculty,Teaches,Chats
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import HttpResponse

fac=""
dep=""
cla=""
cou=""
sem=""


def initial(fact,dept):
    global fac,dep
    fac=fact
    dep=dept

    return


@api_view(['POST'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def set_fac(request):
    global fac
    global dep
    if request.method == 'POST':
        data = json.loads(request.body)
        username1 = data.get('username1')
        facl = Faculty.objects.filter(fac_id=username1)
        fac = username1
        d = facl.get().dept_id.dept_id
        initial(username1, d)
        return HttpResponse(f"fac set to {fac}")
    else:
        return HttpResponse("Invalid request method")

@api_view(['GET'])
def fac_data_view(request):
    # Fetch the user data based on the authenticated user
    student = get_object_or_404(Faculty, fac_id=fac)

    user_data = {
        "name": f"{student.f_name} {student.l_name}",
        "department": student.dept_id.dept_name,
        "id":fac,

        "dob": student.dob.strftime('%Y-%m-%d'),  # Format dob as YYYY-MM-DD string
        "phone": student.phone,
        "email": student.email,
        
    }

    return Response(user_data)


@api_view(['POST'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def fac_login(request):
    if request.method == 'POST':
        print("hello")  # Print "hello" when the POST request is received
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data.get('username')
            password = serializer.validated_data.get('password')
            facl = Faculty.objects.filter(fac_id=username)
            if facl.exists():
                print("user exists")
                if facl.get().f_password == password:
                    d = facl.get().dept_id.dept_id
                    initial(username, d)
                    # Send the username to the frontend
                    return Response({'username': username, 'redirect_url': 'http://localhost:3000/faculty_home/'})
                else:
                    return Response({'message': 'invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'message': 'invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        # Rest of your code...
        # ...
        return Response(status=status.HTTP_200_OK)
    
@api_view(['GET'])
def get_lab_details(request):
    
     labs = Teaches.objects.filter(fac_id=fac)

     lab_names = [lab.subject_name for lab in labs]
     print(lab_names)

     return Response({"lab_names": lab_names})

@api_view(['POST'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def get_attendance_data(request):
    if request.method == 'POST':
        # Get the parameters from the POST request data
        date = request.data.get('date')
        subject_name = request.data.get('class')
        batch = request.data.get('batch')
        print(date)
        print(subject_name)
        print(batch)

        # Filter the CourseDiary model based on the provided parameters
        attendance_data = CourseDiary.objects.filter(
            date=date,
            subject__subject_name=subject_name,
            batch=batch
        )

        # Serialize the filtered data
        serialized_data = [
            {
                'date': data.date,
                'subject_name': data.subject.subject_name,
                'student_name': data.student.stud_id,
                'batch': data.batch,
                'attendance': data.attendance,
                'vivamark': data.vivamark,
                'output': data.output,
                'programname': data.programname
            }
            for data in attendance_data
        ]

        # Return the serialized data as a JSON response
        return JsonResponse({'attendance_data': serialized_data})
    else:
        return JsonResponse({'message': 'No data found'}, status=404)

@api_view(['POST'])
@permission_classes([AllowAny])
def get_student_names(request):
    if request.method == 'POST':
        subject_name = request.data.get('class')  # Update key to match frontend
        batch = request.data.get('batch')
        # Ensure that subject_name and batch have correct values
        

        try:
            subject = Subject.objects.get(subject_name=subject_name)
            students = Student.objects.filter(sem=subject.semester, batch=batch)
            student_names = [f"{student.f_name} {student.l_name}" for student in students]
            print(student_names)
            return JsonResponse({'student_names': student_names})
        except Subject.DoesNotExist:
            return JsonResponse({'error': 'Subject not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def save_course_diary(request):
    if request.method == 'POST':
        data = request.POST
        print(data)
        date = data.get('date')
        subject_name = data.get('subject')
        batch = data.get('batch')
        student_names = request.POST.getlist('studentName[]')
        attendances = request.POST.getlist('attendance[]')
        viva_marks = request.POST.getlist('vivaMark[]')
        outputs = request.POST.getlist('output[]')
        program_names = request.POST.getlist('programName[]')

        # Get or create the Subject instance
        subject, _ = Subject.objects.get_or_create(subject_name=subject_name)

        for index, student_name in enumerate(student_names):
            # Get or create the Student instance
            names = student_name.split()
            first_name = names[0]
            last_name = ' '.join(names[1:])  # Joining the remaining parts as the last name

            # Get or create the Student instance
            student, _ = Student.objects.get_or_create(f_name=first_name, l_name=last_name)

            attendance = 'Present'  # Default attendance value
            viva_mark = 0.0  # Default viva mark value
            output = 'Not Verified'  # Default output value
            program_name = ''  # Default program name value

            # Check if index is within the bounds of the arrays
            if index < len(attendances):
                
                attendance = attendances[index]
                print(attendance)

            if index < len(viva_marks):
                viva_mark = viva_marks[index]

            if index < len(outputs):
                output = outputs[index]

            if index < len(program_names):
                program_name = program_names[index]

            # Create a new CourseDiary instance
            course_diary = CourseDiary(
                date=date,
                name=student_name,
                student=student,
                attendance=attendance,
                vivamark=viva_mark,
                output=output,
                programname=program_name,
                batch=batch,
                subject=subject
            )
            course_diary.save()

        return JsonResponse({'success': True})
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method'})
    
@api_view(['GET'])
def get_queryset(request):
    subject = request.GET.get('subject')
    messages = Chats.objects.filter(subject=subject)
    serializer = ChatSerializer(messages, many=True)
    print(serializer.data)
    return Response(serializer.data)

@csrf_exempt
def create_chat(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        subject = data.get('subject')
        sender_id = data.get('sender_id')
        message = data.get('message')
        chat = Chats.objects.create(
            subject=subject,
            sender_id=sender_id,
            message=message
        )
        serializer = ChatSerializer(chat)
        return JsonResponse({'status': 'success', 'data': serializer.data})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'})