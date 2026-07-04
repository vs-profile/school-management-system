"""
API views for the School Management System.

Each view mirrors the equivalent controller from the original Express
backend, using the same SQL and LEFT JOINs so missing classroom/teacher
data still surfaces rather than being silently excluded.
"""
from django.http import JsonResponse, Http404
from django.views.decorators.http import require_GET

from .db import run_query, run_query_one

STUDENT_LIST_QUERY = """
    SELECT
        s.student_id,
        s.fname,
        s.lname,
        CONCAT(s.fname, ' ', s.lname) AS full_name,
        s.classroom_id,
        c.year,
        c.grade_id,
        c.section,
        c.status AS classroom_status,
        c.remarks,
        c.teacher_id
    FROM student s
    LEFT JOIN classroom c
    ON s.classroom_id = c.classroom_id
    ORDER BY s.student_id DESC
"""

STUDENT_DETAIL_QUERY = """
    SELECT
        s.student_id,
        s.fname,
        s.lname,
        CONCAT(s.fname, ' ', s.lname) AS full_name,
        s.classroom_id,
        c.year,
        c.grade_id,
        c.section,
        c.status AS classroom_status,
        c.remarks,
        c.teacher_id
    FROM student s
    LEFT JOIN classroom c
    ON s.classroom_id = c.classroom_id
    WHERE s.student_id = %s
"""

CLASSROOM_LIST_QUERY = """
    SELECT
        c.classroom_id,
        c.year,
        c.grade_id,
        c.section,
        c.status,
        c.remarks,
        c.teacher_id,
        COUNT(s.student_id) AS total_students
    FROM classroom c
    LEFT JOIN student s
    ON c.classroom_id = s.classroom_id
    GROUP BY c.classroom_id, c.year, c.grade_id, c.section, c.status, c.remarks, c.teacher_id
    ORDER BY c.classroom_id DESC
"""

CLASSROOM_DETAIL_QUERY = """
    SELECT
        c.classroom_id,
        c.year,
        c.grade_id,
        c.section,
        c.status,
        c.remarks,
        c.teacher_id,
        COUNT(s.student_id) AS total_students
    FROM classroom c
    LEFT JOIN student s
    ON c.classroom_id = s.classroom_id
    WHERE c.classroom_id = %s
    GROUP BY c.classroom_id, c.year, c.grade_id, c.section, c.status, c.remarks, c.teacher_id
"""

TEACHER_LIST_QUERY = """
    SELECT
        t.*,
        COUNT(DISTINCT c.classroom_id) AS total_classrooms
    FROM teacher t
    LEFT JOIN classroom c ON c.teacher_id = t.teacher_id
    GROUP BY t.teacher_id
    ORDER BY t.teacher_id DESC
"""

ATTENDANCE_LIST_QUERY = """
SELECT
    a.*,
    CONCAT(s.fname, ' ', s.lname) AS student_name,
    co.name AS course_name
FROM attendance a
LEFT JOIN student s
ON a.student_id = s.student_id
LEFT JOIN course co
ON a.course_id = co.course_id
ORDER BY a.date DESC, a.attendance_id DESC
"""

COURSE_LIST_QUERY = "SELECT * FROM course ORDER BY course_id DESC"

EXAM_LIST_QUERY = """
SELECT
    e.exam_id,
    e.name AS exam_name,
    et.name AS exam_type_name,
    e.start_date
FROM exam e
LEFT JOIN exam_type et
ON e.exam_type_id = et.exam_type_id
ORDER BY e.exam_id DESC
"""

RESULT_LIST_QUERY = """
SELECT
    er.exam_id,
    er.student_id,
    er.course_id,
    er.marks,
    CONCAT(s.fname, ' ', s.lname) AS student_name,
    e.name AS exam_name,
    co.name AS course_name
FROM exam_result er
LEFT JOIN student s
ON er.student_id = s.student_id
LEFT JOIN exam e
ON er.exam_id = e.exam_id
LEFT JOIN course co
ON er.course_id = co.course_id
ORDER BY er.exam_id DESC
"""


# --- Dashboard ---------------------------------------------------------

@require_GET
def dashboard_summary(request):
    totals = {
        'totalStudents': run_query_one('SELECT COUNT(*) AS total FROM student')['total'],
        'totalClassrooms': run_query_one('SELECT COUNT(*) AS total FROM classroom')['total'],
        'totalTeachers': run_query_one('SELECT COUNT(*) AS total FROM teacher')['total'],
        'totalAttendanceRecords': run_query_one('SELECT COUNT(*) AS total FROM attendance')['total'],
        'totalExams': run_query_one('SELECT COUNT(*) AS total FROM exam')['total'],
        'totalResults': run_query_one('SELECT COUNT(*) AS total FROM exam_result')['total'],
    }

    recent_students = run_query(STUDENT_LIST_QUERY + ' LIMIT 5')
    classroom_overview = run_query(CLASSROOM_LIST_QUERY + ' LIMIT 5')

    return JsonResponse({
        'success': True,
        'data': {
            'totals': totals,
            'recentStudents': recent_students,
            'classroomOverview': classroom_overview,
        }
    })


# --- Students ------------------------------------------------------------

@require_GET
def student_list(request):
    rows = run_query(STUDENT_LIST_QUERY)
    return JsonResponse({'success': True, 'count': len(rows), 'data': rows})


@require_GET
def student_detail(request, student_id):
    row = run_query_one(STUDENT_DETAIL_QUERY, [student_id])
    if row is None:
        raise Http404(f'Student with id {student_id} not found')
    return JsonResponse({'success': True, 'data': row})


# --- Classrooms ------------------------------------------------------------

@require_GET
def classroom_list(request):
    rows = run_query(CLASSROOM_LIST_QUERY)
    return JsonResponse({'success': True, 'count': len(rows), 'data': rows})


@require_GET
def classroom_detail(request, classroom_id):
    row = run_query_one(CLASSROOM_DETAIL_QUERY, [classroom_id])
    if row is None:
        raise Http404(f'Classroom with id {classroom_id} not found')
    return JsonResponse({'success': True, 'data': row})


# --- Teachers ------------------------------------------------------------

@require_GET
def teacher_list(request):
    rows = run_query(TEACHER_LIST_QUERY)
    return JsonResponse({'success': True, 'count': len(rows), 'data': rows})


# --- Attendance ------------------------------------------------------------

@require_GET
def attendance_list(request):
    rows = run_query(ATTENDANCE_LIST_QUERY)
    return JsonResponse({'success': True, 'count': len(rows), 'data': rows})


# --- Courses ------------------------------------------------------------

@require_GET
def course_list(request):
    rows = run_query(COURSE_LIST_QUERY)
    return JsonResponse({'success': True, 'count': len(rows), 'data': rows})


# --- Exams ------------------------------------------------------------

@require_GET
def exam_list(request):
    rows = run_query(EXAM_LIST_QUERY)
    return JsonResponse({'success': True, 'count': len(rows), 'data': rows})


# --- Results ------------------------------------------------------------

@require_GET
def result_list(request):
    rows = run_query(RESULT_LIST_QUERY)
    return JsonResponse({'success': True, 'count': len(rows), 'data': rows})
