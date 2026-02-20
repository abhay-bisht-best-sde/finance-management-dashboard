from datetime import datetime

from fastapi import APIRouter, HTTPException, Query

from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

MIN_YEAR = 1900
MAX_YEAR = 2100


def _parse_date(s: str) -> datetime | None:
    if not s or len(s) < 10:
        return None
    try:
        return datetime.strptime(s[:10], "%Y-%m-%d")
    except (ValueError, TypeError):
        return None


@router.get("")
async def get_dashboard(
    year: int | None = Query(None, ge=MIN_YEAR, le=MAX_YEAR, description="Filter by year"),
    month: int | None = Query(None, ge=1, le=12, description="Filter by month (1-12)"),
    date_from: str | None = Query(None, description="Start date (YYYY-MM-DD)"),
    date_to: str | None = Query(None, description="End date (YYYY-MM-DD)"),
):
    if date_from is not None or date_to is not None:
        if not date_from or not date_to:
            raise HTTPException(
                status_code=400,
                detail="Both date_from and date_to are required when using a custom date range.",
            )
        d_from = _parse_date(date_from)
        d_to = _parse_date(date_to)
        if d_from is None:
            raise HTTPException(status_code=400, detail="Invalid date_from. Use YYYY-MM-DD.")
        if d_to is None:
            raise HTTPException(status_code=400, detail="Invalid date_to. Use YYYY-MM-DD.")
        if d_from > d_to:
            raise HTTPException(
                status_code=400,
                detail="date_from must be on or before date_to.",
            )
        return await DashboardService.get_aggregates(date_from=date_from, date_to=date_to)
    if month is not None and year is None:
        raise HTTPException(
            status_code=400,
            detail="Month filter requires a year. Please select a year.",
        )
    if year is not None:
        if month is not None:
            return await DashboardService.get_aggregates(year=year, month=month)
        return await DashboardService.get_aggregates(year=year)
    return await DashboardService.get_aggregates()
