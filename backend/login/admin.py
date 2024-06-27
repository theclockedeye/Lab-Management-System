import csv
from django.contrib import admin
from django.http import HttpResponse
from .models import Department, Class, Student, Faculty, Attendance,Subject,Teaches,CourseDiary,Chats,Announcement,PassChangeReq


class AttendanceAdmin(admin.ModelAdmin):
    def export_to_csv(self, request, queryset):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="AttendanceReport.csv"'
        writer = csv.writer(response)
        writer.writerow(['Stud-Id', 'Faculty-Id', 'Dept', 'Course-Id', 'Date(dd-mm-yyyy)', 'Status'])
        for obj in queryset:
            status = 'Present' if obj.presence else 'Absent'
            writer.writerow([obj.stud_id.stud_id, obj.fac_id.fac_id, obj.stud_id.dept_id.dept_id,
                             obj.course_id.course_id, obj.date, status])
        return response

    export_to_csv.short_description = 'Export to CSV'

    list_display = ('stud_id', 'fac_id', 'course_id', 'date', 'presence')
    actions = [export_to_csv]





admin.site.register(Department)
admin.site.register(Class)
admin.site.register(Student)
admin.site.register(Faculty)
admin.site.register(Attendance, AttendanceAdmin)
admin.site.register(Subject)
admin.site.register(Teaches)
admin.site.register(CourseDiary)
admin.site.register(Chats)
admin.site.register(Announcement)
admin.site.register(PassChangeReq)
