from django.urls import path
from . import views
from login.views import login_view
from login.views import user_data_view,get_lab_details,set_stud,get_subject_details,get_lab_attendance_percentages,get_subject_vivamarks,get_subject_details2,get_pending_works,get_announcements,submit_password_change_request,get_lab_attendance_and_marks

urlpatterns = [
    path('hello-world/', views.hello_world, name='hello_world'),
    path('login/',login_view, name='login_view'),
    path('user-data/', user_data_view, name="user-data"),
    path('lab-details/', get_lab_details, name="get_lab_details"),
    path('set_stud/', set_stud, name="set_stud"),
    path('subject-details/<str:subject_id>/', get_subject_details, name='subject-details'),
    path('subject-details2/<str:subject_id>/', get_subject_details2, name='subject-details2'),
    path('lab-attendance-percentages/', get_lab_attendance_percentages, name='lab-attendance-percentages'),
   path('subject-vivamarks/<str:username1>/', get_subject_vivamarks, name='subject-vivamarks'),
   path('pending-works/',get_pending_works, name='pending-works'),
   path('announcements/', get_announcements, name='get_announcements'),
   path('submit-password-change-request/', submit_password_change_request, name='submit_password_change_request'),
   path('get_lab_attendance_and_marks/', get_lab_attendance_and_marks, name='get_lab_attendance_and_marks'),
   

]