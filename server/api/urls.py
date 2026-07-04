from django.urls import path

from . import views

urlpatterns = [
    path('dashboard', views.dashboard_summary),

    path('students', views.student_list),
    path('students/<int:student_id>', views.student_detail),

    path('classrooms', views.classroom_list),
    path('classrooms/<int:classroom_id>', views.classroom_detail),

    path('teachers', views.teacher_list),
    path('attendance', views.attendance_list),
    path('courses', views.course_list),
    path('exams', views.exam_list),
    path('results', views.result_list),
]
