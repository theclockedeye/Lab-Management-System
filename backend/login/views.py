# Create your views here.
from datetime import timezone
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token
from django.views.decorators.cache import never_cache
from .models import Announcement, PassChangeReq, students
from .forms import insert_Form
from login.models import Student
from django.db.models import Sum
import json
from django.db.models import Q,F

# views.py
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.forms import AuthenticationForm
from rest_framework.permissions import AllowAny
from .serializers import LoginSerializer

from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Student, Department, Class,Subject,CourseDiary

fac=""
dep=""
cla=""
cou=""
sem=""


def initial(fact,dept):
    global fac,dep,sem
    fac=fact
    dep=dept
    student = get_object_or_404(Student, stud_id=fac)
    sem=student.sem
  
    return

def tial(clat,cout):
    global cla,cou
    cla=clat
    cou=cout
    return


@api_view(['GET'])
def user_data_view(request):
    # Fetch the user data based on the authenticated user
    student = get_object_or_404(Student, stud_id=fac)

    user_data = {
        "name": f"{student.f_name} {student.l_name}",
        "department": student.dept_id.dept_name,
        "class": student.class_id.class_id,
        "dob": student.dob.strftime('%Y-%m-%d'),  # Format dob as YYYY-MM-DD string
        "phone": student.phone,
        "email": student.email,
        "sem": student.sem,
    }

    return Response(user_data)


@api_view(['GET'])
def get_lab_details(request):
    
     labs = Subject.objects.filter(semester=sem, department=dep)

     lab_names = [lab.subject_name for lab in labs]
     print(lab_names)

     return Response({"lab_names": lab_names})
    



@api_view(['POST'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def login_view(request):
    if request.method == 'POST':
        print("hello")  # Print "hello" when the POST request is received

        # Your existing code to handle the POST request
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data.get('username')
            password = serializer.validated_data.get('password')
            user_type = serializer.validated_data.get('user_type')
            std=Student.objects.filter(stud_id=username)

            if std.exists():
                print("user exists")
                if std.get().s_password==password:
                     d=std.get().dept_id.dept_id
                     sem=std.get().sem
                     initial(username,d)
                     return Response({'username': username,'redirect_url':'http://localhost:3000/home/'})
                else:
                    return Response({'message':'invalid credentials'},status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'message':'invalid credentials'},status=status.HTTP_400_BAD_REQUEST)
        
                    

            

            # Rest of your code...
            # ...

        return Response(status=status.HTTP_200_OK)

def login_view1(request):
    # Handle user login logic here
    serializer=LoginSerializer(data=request.data)
    if serializer.is_valid():
        username=serializer.validated_data.get('username')
        password=serializer.validated_data.get('password')
        usertype=serializer.validated_data.get('user_type')

        if usertype=='faculty':
            user = authenticate(request, username=username, password=password)
            if user is not None and user.is_staff:
                login(request,user)
                print('faculty authenticated')
                return Response({'redirect_url':'http://localhost:3000/faculty_home/'})
            else:
                return Response({'message':'invalid credentials'},status=status.HTTP_400_BAD_REQUEST)
            
        elif usertype=='student':
            user=authenticate(request,username=username,password=password)
            if user is not None and not user.is_staff:
                login(request,user)
                print('student authenticated')
                return Response({'redirect_url':'http://localhost:3000/home/'})
            else:
                return Response({'message':'Invalid credentials'},status=status.HTTP_400_BAD_REQUEST)
                
    return Response(status=status.HTTP_200_OK)


def home_view(request):
    try:
        username=request.GET.get('variable')
        student_data=students.objects.get(name=username)
        return render(request,'student.html',{'student_data':student_data})
    except students.DoesNotExist:
        # Handle the case when the student with the given username is not found
        return redirect('login')

def fhome_view(request):
    return render(request,'faculty.html')

def authlogout(request):
    return redirect('login')

def insert_data(request):
    if request.method == 'POST':
        frm=insert_Form(request.POST)
        if frm.is_valid():
            frm.save()
    frm=insert_Form()
    return render(request,'create.html',{'frm':frm})

@api_view(['POST'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def set_stud(request):
    print("hi")
    global fac
    global dep
    if request.method == 'POST':
        data = json.loads(request.body)
        username1 = data.get('username1')
        print(username1)
        facl = Student.objects.filter(stud_id=username1)
        fac = username1
        d = facl.get().dept_id.dept_id
        initial(username1, d)
        return HttpResponse(f"fac set to {fac}")
        print("done")
    else:
        return HttpResponse("Invalid request method")

#subject viva marks   
@api_view(['GET'])
def get_subject_details(request, subject_id):
    print(subject_id)
    print("hi")
    username1 = request.GET.get('username1')
    print(username1)
    student = get_object_or_404(Student, stud_id=username1)
    subject = get_object_or_404(Subject, subject_name=subject_id)
    course_diary_entries = CourseDiary.objects.filter(student=student, subject=subject).values('date', 'vivamark')
    data = list(course_diary_entries)
    return Response(data)


@api_view(['GET'])
def get_subject_details2(request, subject_id):
    print(subject_id)
    print("hi 2")
    username1 = request.GET.get('username1')
    print(username1)
    student = get_object_or_404(Student, stud_id=username1)
    subject = get_object_or_404(Subject, subject_name=subject_id)
    course_diary_entries = CourseDiary.objects.filter(student=student, subject=subject).values('date', 'attendance')
    data = list(course_diary_entries)
    print(data)
    return Response(data)

@api_view(['GET'])
def get_lab_attendance_percentages(request):
    username1 = request.GET.get('username1')
    student = get_object_or_404(Student, stud_id=username1)
    labs = Subject.objects.filter(semester=student.sem, department=student.dept_id)
    lab_attendance_data = []

    for lab in labs:
        total_entries = CourseDiary.objects.filter(subject=lab, student=student).count()
        present_entries = CourseDiary.objects.filter(subject=lab, student=student, attendance='Present').count()
        if total_entries > 0:
            attendance_percentage = round((present_entries / total_entries) * 100, 2)
        else:
            attendance_percentage = 0.0
        lab_attendance_data.append({
            'subject_name': lab.subject_name,
            'attendance_percentage': attendance_percentage
        })

    return Response(lab_attendance_data)

@api_view(['GET'])
def get_subject_vivamarks(request, username1):
    student = get_object_or_404(Student, stud_id=username1)
    labs = Subject.objects.filter(semester=student.sem, department=student.dept_id)
    subject_vivamarks = []
    for lab in labs:
        attendance_count = CourseDiary.objects.filter(student=student, subject=lab).values('date').distinct().count()
        total_vivamark = CourseDiary.objects.filter(student=student, subject=lab).aggregate(Sum('vivamark'))['vivamark__sum']
        max_vivamark = attendance_count * 20
        if total_vivamark is None:
            total_vivamark = 0.0
        subject_vivamarks.append({
            'subject_name': lab.subject_name,
            'total_vivamark': total_vivamark,
            'max_vivamark': max_vivamark
        })
    return Response(subject_vivamarks)

from django.db.models import Q

def get_pending_works(request):
    username1 = request.GET.get('username1')
    student = Student.objects.get(stud_id=username1)
    pending_works = CourseDiary.objects.filter(
        Q(student=student) & Q(output='Not Verified')
    ).values(
        'programname',
        'subject__subject_name'
    )
    data = [
        {
            'subject': f" {item['subject__subject_name']} : ",
            'programname': item['programname']
        }
        for item in pending_works
    ]
    return JsonResponse(data, safe=False)
def get_announcements(request):
    announcements = Announcement.objects.values('message', 'date')
    return JsonResponse(list(announcements), safe=False)

@api_view(['POST'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def submit_password_change_request(request):
    if request.method == 'POST':
        username1 = request.POST.get('username1')
        print(username1)  # Print the received username1 for debugging purposes

        # Get the Student object or return a 404 error if it doesn't exist
        student = get_object_or_404(Student, stud_id=username1)

        # Check if a recent request already exists
        recent_request_exists = PassChangeReq.objects.filter(
            student=student,
            time__gte=timezone.now() - timezone.timedelta(hours=24)
        ).exists()

        if recent_request_exists:
            return JsonResponse({
                'status': 'error',
                'message': 'A recent request already exists. Please wait.'
            })

        # Create a new request
        new_request = PassChangeReq(student=student)
        new_request.save()

        return JsonResponse({
            'status': 'success',
            'message': 'Request submitted successfully.'
        })

    return JsonResponse({
        'status': 'error',
        'message': 'Invalid request method.'
    })


def get_lab_attendance_and_marks(request):
    username1 = request.GET.get('username1')
    student = get_object_or_404(Student, stud_id=username1)
    labs = Subject.objects.filter(semester=student.sem, department=student.dept_id)
    lab_data = []

    for lab in labs:
        total_entries = CourseDiary.objects.filter(subject=lab, student=student).count()
        present_entries = CourseDiary.objects.filter(subject=lab, student=student, attendance='Present').count()

        if total_entries > 0:
            attendance_percentage = round((present_entries / total_entries) * 100, 2)
        else:
            attendance_percentage = 0.0

        attendance_count = CourseDiary.objects.filter(student=student, subject=lab).values('date').distinct().count()
        total_vivamark = CourseDiary.objects.filter(student=student, subject=lab).aggregate(Sum('vivamark'))['vivamark__sum']
        max_vivamark = attendance_count * 20

        if total_vivamark is None:
            total_vivamark = 0.0

        mark_out_of_50 = round((total_vivamark / max_vivamark) * 50, 2)

        lab_data.append({
            'subject_name': lab.subject_name,
            'attendance_percentage': attendance_percentage,
            'mark_out_of_50': mark_out_of_50
        })

    return Response(lab_data)