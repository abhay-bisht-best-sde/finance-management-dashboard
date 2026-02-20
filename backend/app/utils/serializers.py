"""Serialize DB rows to API response shape (camelCase for frontend)."""


def row_to_expense(row: dict) -> dict:
    """Convert expense row (snake_case) to API shape (camelCase)."""
    out = dict(row)
    if "created_at" in out:
        out["createdAt"] = out.pop("created_at")
    if "updated_at" in out:
        out["updatedAt"] = out.pop("updated_at")
    for k in ("createdAt", "updatedAt", "date"):
        if k in out and hasattr(out[k], "isoformat"):
            out[k] = out[k].isoformat()
    return out
