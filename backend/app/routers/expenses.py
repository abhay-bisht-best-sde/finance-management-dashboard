from fastapi import APIRouter, HTTPException, Query

from app.models.schemas import ExpenseCreate, ExpenseUpdate
from app.services.expense_service import ExpenseService

router = APIRouter(prefix="/api/expenses", tags=["expenses"])


@router.get("")
async def list_expenses(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    category: str | None = None,
    status: str | None = None,
    search: str | None = None,
    sortBy: str = "date",
    sortOrder: str = "desc",
):
    return await ExpenseService.list(
        page=page,
        limit=limit,
        category=category,
        status=status,
        search=search,
        sort_by=sortBy,
        sort_order=sortOrder,
    )


@router.post("", status_code=201)
async def create_expense(body: ExpenseCreate):
    expense = await ExpenseService.create(body)
    return {"data": expense}


@router.get("/{id}")
async def get_expense(id: str):
    expense = await ExpenseService.get_by_id(id)
    if expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    return {"data": expense}


@router.put("/{id}")
async def update_expense_put(id: str, body: ExpenseUpdate):
    return await _update(id, body)


@router.patch("/{id}")
async def update_expense_patch(id: str, body: ExpenseUpdate):
    return await _update(id, body)


async def _update(id: str, body: ExpenseUpdate):
    expense = await ExpenseService.update(id, body)
    if expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    return {"data": expense}


@router.delete("/{id}")
async def delete_expense(id: str):
    await ExpenseService.delete(id)
    return {"message": "Expense deleted successfully"}
