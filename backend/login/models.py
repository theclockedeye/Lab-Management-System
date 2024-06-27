from django.db import models

# Create your models here.
class academics(models.Model):
    current_sem=models.IntegerField()
    completed_sem=models.IntegerField()
    cgpa=models.FloatField()
    overall_status=models.TextField()
    attendance_perc=models.FloatField()

class students(models.Model):
    name=models.CharField(max_length=15)
    register_number=models.CharField(max_length=10)
    acad_details=models.OneToOneField(academics,on_delete=models.CASCADE,related_name='academics',null=True)

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.validators import MinValueValidator, MaxValueValidator


DAYS_CHOICE=[('mon','Monday'),('tue','Tuesday'),('wed','Wednesday'),('thu','Thursday'),('fri','Friday'),('sat','Saturday'),]
LEAVE_CHOICE=[('ml','Medical Leave'),('od','On Duty')]

class Department(models.Model):
    dept_id = models.CharField(max_length=20,primary_key = True)
    dept_name = models.CharField(max_length=50)

class Admin(models.Model):
    admin_id = models.CharField(max_length=20,primary_key = True)
    password =models.CharField(max_length=30)

class Class(models.Model):
    class_id = models.CharField(max_length=20,primary_key=True)
    total_students = models.IntegerField(validators=[MinValueValidator(1),
                                       MaxValueValidator(100)])

class Student(models.Model):
    stud_id = models.CharField(max_length=20, primary_key=True)
    s_password = models.CharField(max_length=30)
    in_out = models.CharField(max_length=5)
    f_name = models.CharField(max_length=20)
    l_name = models.CharField(max_length=20)
    dob = models.DateField(default='1900-01-01') # Add DateField for date of birth (dob)
    phone = models.CharField(max_length=15, default='000-000-0000')
  # Add CharField for phone number
    email = models.EmailField(default='example@example.com')# Add EmailField for email address
    sem = models.IntegerField(default=1)  # Add IntegerField for semester (sem)
    dept_id = models.ForeignKey(Department, on_delete=models.CASCADE)
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE)
    batch = models.IntegerField(default=1)

class Faculty(models.Model):
    fac_id = models.CharField(max_length=20,primary_key=True)
    f_password = models.CharField(max_length=30)
    f_name = models.CharField(max_length=20)
    l_name = models.CharField(max_length=20)
    dept_id = models.ForeignKey(Department, on_delete=models.CASCADE)
    dob = models.DateField(default='1900-01-01') # Add DateField for date of birth (dob)
    phone = models.CharField(max_length=15, default='000-000-0000')
  # Add CharField for phone number
    email = models.EmailField(default='example@example.com')# Add EmailField for email address

class Calender(models.Model):
    i=models.AutoField(primary_key=True)
    dates = models.DateField()
    day = models.CharField(max_length=9,choices=DAYS_CHOICE,default=None,blank=False)

class Course(models.Model):
    course_id = models.CharField(max_length=20,primary_key=True)
    course_name = models.CharField(max_length=50)
    credits = models.IntegerField(validators=[MinValueValidator(1),
                                       MaxValueValidator(5)])
    
class Attendance(models.Model):
    stud_id = models.ForeignKey(Student, on_delete=models.CASCADE)
    fac_id = models.ForeignKey(Faculty, on_delete=models.CASCADE)
    course_id = models.ForeignKey(Course, on_delete=models.CASCADE)
    date = models.DateField()
    presence = models.IntegerField(validators=[MinValueValidator(0),
                                       MaxValueValidator(1)])
    periods = models.IntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(8)])
    
    class Meta:
        # Define unique constraint
        unique_together = (("stud_id", "course_id", "date"),)

class Slot(models.Model):
    period_id=models.IntegerField(validators=[MinValueValidator(1),
                                       MaxValueValidator(8)],primary_key=True)
    start_time = models.TimeField()
    end_time = models.TimeField()

class Holiday(models.Model):
    date = models.DateField(primary_key=True)
    description = models.CharField(max_length=100)

class Advisor(models.Model):
    fac_id = models.ForeignKey(Faculty, on_delete=models.CASCADE)
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE)

class Leave(models.Model):
    stud_id = models.ForeignKey(Student, on_delete=models.CASCADE)
    reason = models.CharField(max_length=100)
    leave_type = models.CharField(max_length=9,choices=LEAVE_CHOICE,default=None,blank=False)
    approved = models.IntegerField(validators=[MinValueValidator(0),
                                       MaxValueValidator(1)])


class Timetable(models.Model):
    course_id = models.ForeignKey(Course, on_delete=models.CASCADE)
    day = models.CharField(max_length=9, choices=DAYS_CHOICE, default=None, blank=False)
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE)
    periods = models.ForeignKey(Slot, on_delete=models.CASCADE)  # Corrected field name

    class Meta:
        unique_together = (("class_id", "course_id", "day", "periods"),)


class Teache(models.Model):
    fac_id = models.ForeignKey(Faculty, on_delete=models.CASCADE)
    course_id = models.ForeignKey(Course, on_delete=models.CASCADE)
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE)
    class Meta:
        unique_together = (("course_id", "class_id"),)

class Subject(models.Model):
    subject_name = models.CharField(max_length=50)
    semester = models.IntegerField(validators=[MinValueValidator(1)])
    department = models.ForeignKey(Department, on_delete=models.CASCADE)

class Teaches(models.Model):
    fac_id = models.ForeignKey(Faculty, on_delete=models.CASCADE)
    subject_name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.fac_id} - {self.subject_name}"

class CourseDiary(models.Model):
    date = models.DateField()
    name = models.CharField(max_length=100)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, null=True)
    ATTENDANCE_CHOICES = [
        ('Present', 'Present'),
        ('Absent', 'Absent'),
    ]
    attendance = models.CharField(max_length=10, choices=ATTENDANCE_CHOICES)
    vivamark = models.FloatField()
    OUTPUT_CHOICES = [
        ('Verified', 'Verified'),
        ('Not Verified', 'Not Verified'),
    ]
    output = models.CharField(max_length=12, choices=OUTPUT_CHOICES)
    programname = models.CharField(max_length=100)
    batch = models.IntegerField(choices=[(1, '1'), (2, '2')], null=True)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, null=True)

class Chats(models.Model):
    subject = models.CharField(max_length=255)
    sender_id = models.CharField(max_length=20)
    message = models.TextField()
    time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.subject} - {self.sender_id} - {self.message[:20]}..."
    
class Announcement(models.Model):
    message = models.TextField()
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.message


class PassChangeReq(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='pass_change_reqs')
    time = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Password Change Request'
        verbose_name_plural = 'Password Change Requests'

    def __str__(self):
        return f"Password Change Request for {self.student.username} at {self.time}"