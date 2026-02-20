from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class ExpenseStatus(str, Enum):
    pending = "pending"
    completed = "completed"
    cancelled = "cancelled"


class ExpenseCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    amount: float = Field(..., gt=0)
    category: str = Field(..., min_length=1)
    status: ExpenseStatus = ExpenseStatus.pending
    description: Optional[str] = None
    date: Optional[str] = None


class ExpenseUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    amount: Optional[float] = Field(None, gt=0)
    category: Optional[str] = Field(None, min_length=1)
    status: Optional[ExpenseStatus] = None
    description: Optional[str] = None
    date: Optional[str] = None


class AdvisorRequest(BaseModel):
    stocks: list[dict]
    budget: Optional[str] = None
    riskLevel: Optional[str] = None
    messages: Optional[list[dict]] = None
