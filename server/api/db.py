"""
Small helper around Django's raw database cursor.

The `school` database already exists with its own schema and data, so
instead of declaring Django models for every table (which would require
guessing at exact column names for tables like `teacher` and `course`),
queries are run directly with SQL and returned as JSON-serializable dicts.
This mirrors how the original mysql2-based Node backend worked.
"""
from django.db import connection


def dictfetchall(cursor):
    """Return all rows from a cursor as a list of dicts."""
    columns = [col[0] for col in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]


def dictfetchone(cursor):
    """Return a single row from a cursor as a dict, or None."""
    columns = [col[0] for col in cursor.description]
    row = cursor.fetchone()
    if row is None:
        return None
    return dict(zip(columns, row))


def run_query(sql, params=None):
    """Execute a SELECT and return all rows as a list of dicts."""
    with connection.cursor() as cursor:
        cursor.execute(sql, params or [])
        return dictfetchall(cursor)


def run_query_one(sql, params=None):
    """Execute a SELECT and return a single row as a dict, or None."""
    with connection.cursor() as cursor:
        cursor.execute(sql, params or [])
        return dictfetchone(cursor)
