from django import forms
from .models import students
from .models import academics

from django import forms
from .models import students
from .models import academics

class insert_Form(forms.ModelForm):
    current_sem = forms.IntegerField()
    completed_sem = forms.IntegerField()
    cgpa = forms.FloatField()
    overall_status = forms.CharField(widget=forms.Textarea)
    attendance_perc = forms.FloatField()

    class Meta:
        model = students
        fields = '__all__'
        exclude = ['acad_details'] 
    def save(self, commit=True):
        student = super().save(commit=False)
        acad_details = academics.objects.create(
            current_sem=self.cleaned_data['current_sem'],
            completed_sem=self.cleaned_data['completed_sem'],
            cgpa=self.cleaned_data['cgpa'],
            overall_status=self.cleaned_data['overall_status'],
            attendance_perc=self.cleaned_data['attendance_perc']
        )
        student.acad_details = acad_details
        if commit:
            student.save()
        return student