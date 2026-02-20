import random

from app.utils.stocks import (
    FALLBACK_STOCKS,
    NSE_STOCK_META,
    fetch_nse_quotes,
)


class StockService:
    @classmethod
    async def get_stocks(cls) -> dict:
        quotes = await fetch_nse_quotes()
        if quotes:
            by_symbol = {q["symbol"]: q for q in quotes}
            data = []
            for m in NSE_STOCK_META:
                q = by_symbol.get(m["yahoo_symbol"])
                if q:
                    price = q.get("regularMarketPrice") or 0
                    change = q.get("regularMarketChangePercent") or 0
                    if price > 0:
                        data.append({
                            "symbol": m["symbol"],
                            "name": m["name"],
                            "sector": m["sector"],
                            "price": round(float(price), 2),
                            "change": round(float(change), 2),
                            "pe": m["pe"],
                            "marketCap": m["market_cap"],
                        })
            if data:
                return {"data": data, "source": "yahoo"}
        out = [
            {
                **s,
                "price": round(s["price"] * (1 + (random.random() - 0.5) * 0.02), 2),
                "change": round(s["change"] + (random.random() - 0.5) * 0.5, 2),
            }
            for s in FALLBACK_STOCKS
        ]
        return {"data": out, "source": "fallback"}
