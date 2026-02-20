from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.models.schemas import AdvisorRequest
from app.services.advisor_service import AdvisorService

router = APIRouter(prefix="/api/stocks/advisor", tags=["advisor"])


@router.post("")
async def advisor_stream(body: AdvisorRequest):
    try:
        async def stream():
            async for chunk in AdvisorService.stream_advice(body):
                yield chunk

        return StreamingResponse(
            stream(),
            media_type="text/event-stream",
            headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
        )
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
