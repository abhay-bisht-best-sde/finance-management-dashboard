import uuid

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request


TRACE_ID_HEADER = "x-trace-id"


class TraceIDMiddleware(BaseHTTPMiddleware):
    """Adds a unique trace ID to each request (header + state) for correlation."""

    async def dispatch(self, request: Request, call_next):
        trace_id = request.headers.get(TRACE_ID_HEADER) or str(uuid.uuid4())
        request.state.trace_id = trace_id
        response = await call_next(request)
        response.headers[TRACE_ID_HEADER] = trace_id
        return response
