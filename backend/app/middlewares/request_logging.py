import logging

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

logger = logging.getLogger(__name__)

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Logs each incoming request (method, path, trace_id)."""

    async def dispatch(self, request: Request, call_next):
        trace_id = getattr(request.state, "trace_id", None)
        logger.debug(
            "Request %s %s",
            request.method,
            request.url.path,
            extra={"trace_id": trace_id} if trace_id else {},
        )
        response = await call_next(request)
        return response
