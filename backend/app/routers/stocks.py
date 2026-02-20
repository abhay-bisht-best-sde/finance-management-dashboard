from fastapi import APIRouter

from app.services.stock_service import StockService

router = APIRouter(prefix="/api/stocks", tags=["stocks"])


@router.get("")
async def get_stocks():
    return await StockService.get_stocks()
