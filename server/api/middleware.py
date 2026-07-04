"""
Central error handler, equivalent to the errorHandler middleware in the
original Express backend. Catches database and view exceptions and returns
a consistent JSON error response instead of Django's default HTML error page.
"""
import logging

from django.db.utils import OperationalError, ProgrammingError
from django.http import JsonResponse, Http404

logger = logging.getLogger(__name__)

# Common MySQL error numbers, matched against exception args[0]
ERROR_MESSAGES = {
    2003: ('Could not connect to the database. Is MySQL running?', 503),
    1045: ('Database access denied. Check DB_USER and DB_PASSWORD in .env.', 503),
    1049: ('Database "school" does not exist.', 503),
    1146: ('Database table not found.', 500),
}


class ApiExceptionMiddleware:
    """Wraps every request/response cycle and converts uncaught
    exceptions raised in views into JSON error responses."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_exception(self, request, exception):
        if not request.path.startswith('/api/'):
            return None

        if isinstance(exception, Http404):
            return JsonResponse(
                {'success': False, 'message': str(exception) or 'Not found'},
                status=404,
            )

        if isinstance(exception, (OperationalError, ProgrammingError)):
            code = exception.args[0] if exception.args else None
            message, status = ERROR_MESSAGES.get(
                code, (f'Database error: {exception}', 500)
            )
            logger.error('❌ Database error: %s', exception)
            return JsonResponse({'success': False, 'message': message}, status=status)

        logger.error('❌ API Error: %s', exception)
        return JsonResponse(
            {'success': False, 'message': 'Internal server error'}, status=500
        )
