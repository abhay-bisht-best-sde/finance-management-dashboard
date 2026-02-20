from datetime import datetime

from app.database.prisma_client import PrismaClient
from app.models.schemas import ExpenseCreate, ExpenseUpdate, ExpenseStatus
from app.utils.serializers import row_to_expense


def _parse_date(value: str | datetime | None) -> datetime:
    if not value:
        return datetime.utcnow()
    if isinstance(value, datetime):
        return value
    try:
        s = value.replace("Z", "+00:00") if isinstance(value, str) else str(value)
        return datetime.fromisoformat(s)
    except (ValueError, TypeError):
        return datetime.utcnow()


def _expense_to_response(expense) -> dict:
    return row_to_expense(
        expense.model_dump() if hasattr(expense, "model_dump") else expense
    )


class ExpenseService:
    @classmethod
    async def list(
        cls,
        page: int = 1,
        limit: int = 20,
        category: str | None = None,
        status: str | None = None,
        search: str | None = None,
        sort_by: str = "date",
        sort_order: str = "desc",
    ) -> dict:
        prisma = PrismaClient.get_client()
        where: dict = {}
        if category:
            where["category"] = category
        if status:
            where["status"] = status
        if search and search.strip():
            where["title"] = {"contains": search.strip(), "mode": "insensitive"}

        order_field = (
            "created_at"
            if sort_by in ("created_at", "createdAt")
            else "updated_at"
            if sort_by in ("updated_at", "updatedAt")
            else sort_by
        )
        order = {order_field: "asc" if sort_order.lower() == "asc" else "desc"}

        skip = (page - 1) * limit
        total = await prisma.expense.count(where=where or None)
        items = await prisma.expense.find_many(
            where=where or None,
            order=[order],
            skip=skip,
            take=limit,
        )
        return {
            "data": [_expense_to_response(e) for e in items],
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "totalPages": (total + limit - 1) // limit,
            },
        }

    @classmethod
    async def get_by_id(cls, id: str) -> dict | None:
        prisma = PrismaClient.get_client()
        expense = await prisma.expense.find_unique(where={"id": id})
        if expense is None:
            return None
        return _expense_to_response(expense)

    @classmethod
    async def create(cls, body: ExpenseCreate) -> dict:
        prisma = PrismaClient.get_client()
        data = {
            "title": body.title,
            "amount": body.amount,
            "category": body.category,
            "status": body.status.value,
            "description": body.description,
            "date": _parse_date(body.date),
        }
        expense = await prisma.expense.create(data=data)
        return _expense_to_response(expense)

    @classmethod
    async def update(cls, id: str, body: ExpenseUpdate) -> dict | None:
        prisma = PrismaClient.get_client()
        payload = body.model_dump(exclude_unset=True)
        if "status" in payload and isinstance(payload["status"], ExpenseStatus):
            payload["status"] = payload["status"].value
        if "date" in payload and isinstance(payload["date"], str):
            payload["date"] = _parse_date(payload["date"])
        if not payload:
            return await cls.get_by_id(id)
        expense = await prisma.expense.update(where={"id": id}, data=payload)
        if expense is None:
            return None
        return _expense_to_response(expense)

    @classmethod
    async def delete(cls, id: str) -> None:
        prisma = PrismaClient.get_client()
        await prisma.expense.delete(where={"id": id})
