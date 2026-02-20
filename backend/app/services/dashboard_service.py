from collections import defaultdict
from datetime import datetime, timedelta

from app.database.prisma_client import PrismaClient


def _date_range(
    *,
    year: int | None = None,
    month: int | None = None,
    date_from: str | None = None,
    date_to: str | None = None,
) -> tuple[datetime | None, datetime | None]:
    """Return (start_dt, end_dt_exclusive) for Prisma date filtering."""
    if date_from and date_to:
        start = datetime.strptime(date_from[:10], "%Y-%m-%d")
        end = datetime.strptime(date_to[:10], "%Y-%m-%d")
        return start, end + timedelta(days=1)
    if year is not None and month is not None:
        start = datetime(year, month, 1)
        end_exclusive = (
            datetime(year + 1, 1, 1)
            if month == 12
            else datetime(year, month + 1, 1)
        )
        return start, end_exclusive
    if year is not None:
        return datetime(year, 1, 1), datetime(year + 1, 1, 1)
    return None, None


class DashboardService:
    @classmethod
    async def get_aggregates(
        cls,
        year: int | None = None,
        month: int | None = None,
        date_from: str | None = None,
        date_to: str | None = None,
    ) -> dict:
        prisma = PrismaClient.get_client()
        start_dt, end_dt = _date_range(
            year=year, month=month, date_from=date_from, date_to=date_to
        )
        where = (
            {"date": {"gte": start_dt, "lt": end_dt}}
            if (start_dt is not None and end_dt is not None)
            else None
        )

        expenses_list = await prisma.expense.find_many(
            where=where,
            order=[{"date": "asc"}],
        )
        expenses = [e.model_dump() for e in expenses_list]

        total_amount = sum(float(e.get("amount", 0)) for e in expenses)
        total_count = len(expenses)
        status_map: dict[str, dict] = defaultdict(
            lambda: {"count": 0, "amount": 0.0}
        )
        category_map: dict[str, dict] = defaultdict(
            lambda: {"count": 0, "amount": 0.0}
        )
        monthly_map: dict[str, dict] = defaultdict(
            lambda: {"count": 0, "amount": 0.0}
        )

        for e in expenses:
            st = e.get("status", "pending")
            status_map[st]["count"] += 1
            status_map[st]["amount"] += float(e.get("amount", 0))
            cat = e.get("category", "")
            category_map[cat]["count"] += 1
            category_map[cat]["amount"] += float(e.get("amount", 0))
            date_val = e.get("date")
            if date_val:
                month_key = (
                    date_val[:7]
                    if isinstance(date_val, str)
                    else str(date_val)[:7]
                )
                monthly_map[month_key]["count"] += 1
                monthly_map[month_key]["amount"] += float(e.get("amount", 0))

        status_data = [
            {
                "status": k.capitalize(),
                "count": v["count"],
                "amount": round(v["amount"], 2),
            }
            for k, v in status_map.items()
        ]
        category_data = [
            {
                "id": k,
                "label": k,
                "value": v["count"],
                "amount": round(v["amount"], 2),
            }
            for k, v in category_map.items()
        ]
        monthly_trend = [
            {"x": k, "y": round(v["amount"], 2), "count": v["count"]}
            for k, v in sorted(monthly_map.items())
        ]
        completed_amount = status_map.get("completed", {}).get("amount", 0) or 0
        pending_amount = status_map.get("pending", {}).get("amount", 0) or 0
        top_categories = sorted(
            [
                {
                    "category": k,
                    "amount": round(v["amount"], 2),
                    "count": v["count"],
                }
                for k, v in category_map.items()
            ],
            key=lambda x: -x["amount"],
        )[:5]

        return {
            "data": {
                "summary": {
                    "totalExpenses": total_count,
                    "totalAmount": round(total_amount, 2),
                    "completedAmount": round(completed_amount, 2),
                    "pendingAmount": round(pending_amount, 2),
                    "averageExpense": round(total_amount / total_count, 2)
                    if total_count
                    else 0,
                },
                "statusData": status_data,
                "categoryData": category_data,
                "monthlyTrend": monthly_trend,
                "topCategories": top_categories,
            },
        }
