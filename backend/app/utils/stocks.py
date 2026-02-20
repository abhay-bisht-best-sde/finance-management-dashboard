import httpx

NSE_STOCK_META = [
    {"symbol": "RELIANCE", "yahoo_symbol": "RELIANCE.NS", "name": "Reliance Industries", "sector": "Energy", "pe": 28.5, "market_cap": "19.9L Cr"},
    {"symbol": "TCS", "yahoo_symbol": "TCS.NS", "name": "Tata Consultancy Services", "sector": "IT", "pe": 32.1, "market_cap": "14.1L Cr"},
    {"symbol": "HDFCBANK", "yahoo_symbol": "HDFCBANK.NS", "name": "HDFC Bank", "sector": "Banking", "pe": 19.2, "market_cap": "12.8L Cr"},
    {"symbol": "INFY", "yahoo_symbol": "INFY.NS", "name": "Infosys", "sector": "IT", "pe": 26.8, "market_cap": "6.4L Cr"},
    {"symbol": "ICICIBANK", "yahoo_symbol": "ICICIBANK.NS", "name": "ICICI Bank", "sector": "Banking", "pe": 17.8, "market_cap": "8.7L Cr"},
    {"symbol": "HINDUNILVR", "yahoo_symbol": "HINDUNILVR.NS", "name": "Hindustan Unilever", "sector": "FMCG", "pe": 55.2, "market_cap": "5.8L Cr"},
    {"symbol": "SBIN", "yahoo_symbol": "SBIN.NS", "name": "State Bank of India", "sector": "Banking", "pe": 10.5, "market_cap": "7.0L Cr"},
    {"symbol": "BHARTIARTL", "yahoo_symbol": "BHARTIARTL.NS", "name": "Bharti Airtel", "sector": "Telecom", "pe": 45.3, "market_cap": "8.9L Cr"},
    {"symbol": "ITC", "yahoo_symbol": "ITC.NS", "name": "ITC Limited", "sector": "FMCG", "pe": 27.1, "market_cap": "5.8L Cr"},
    {"symbol": "KOTAKBANK", "yahoo_symbol": "KOTAKBANK.NS", "name": "Kotak Mahindra Bank", "sector": "Banking", "pe": 21.3, "market_cap": "3.7L Cr"},
    {"symbol": "LT", "yahoo_symbol": "LT.NS", "name": "Larsen & Toubro", "sector": "Infrastructure", "pe": 34.5, "market_cap": "4.8L Cr"},
    {"symbol": "WIPRO", "yahoo_symbol": "WIPRO.NS", "name": "Wipro", "sector": "IT", "pe": 22.4, "market_cap": "2.4L Cr"},
    {"symbol": "AXISBANK", "yahoo_symbol": "AXISBANK.NS", "name": "Axis Bank", "sector": "Banking", "pe": 14.8, "market_cap": "3.5L Cr"},
    {"symbol": "ADANIENT", "yahoo_symbol": "ADANIENT.NS", "name": "Adani Enterprises", "sector": "Conglomerate", "pe": 78.9, "market_cap": "3.3L Cr"},
    {"symbol": "TATAMOTORS", "yahoo_symbol": "TATAMOTORS.NS", "name": "Tata Motors", "sector": "Automobile", "pe": 8.7, "market_cap": "3.5L Cr"},
]

FALLBACK_STOCKS = [
    {"symbol": "RELIANCE", "name": "Reliance Industries", "sector": "Energy", "price": 2945.5, "change": 1.2, "pe": 28.5, "marketCap": "19.9L Cr"},
    {"symbol": "TCS", "name": "Tata Consultancy Services", "sector": "IT", "price": 3890.25, "change": -0.5, "pe": 32.1, "marketCap": "14.1L Cr"},
    {"symbol": "HDFCBANK", "name": "HDFC Bank", "sector": "Banking", "price": 1678.9, "change": 0.8, "pe": 19.2, "marketCap": "12.8L Cr"},
    {"symbol": "INFY", "name": "Infosys", "sector": "IT", "price": 1545.6, "change": -1.1, "pe": 26.8, "marketCap": "6.4L Cr"},
    {"symbol": "ICICIBANK", "name": "ICICI Bank", "sector": "Banking", "price": 1234.75, "change": 1.5, "pe": 17.8, "marketCap": "8.7L Cr"},
    {"symbol": "HINDUNILVR", "name": "Hindustan Unilever", "sector": "FMCG", "price": 2456.3, "change": -0.3, "pe": 55.2, "marketCap": "5.8L Cr"},
    {"symbol": "SBIN", "name": "State Bank of India", "sector": "Banking", "price": 789.45, "change": 2.1, "pe": 10.5, "marketCap": "7.0L Cr"},
    {"symbol": "BHARTIARTL", "name": "Bharti Airtel", "sector": "Telecom", "price": 1567.8, "change": 0.9, "pe": 45.3, "marketCap": "8.9L Cr"},
    {"symbol": "ITC", "name": "ITC Limited", "sector": "FMCG", "price": 467.25, "change": 0.4, "pe": 27.1, "marketCap": "5.8L Cr"},
    {"symbol": "KOTAKBANK", "name": "Kotak Mahindra Bank", "sector": "Banking", "price": 1845.9, "change": -0.7, "pe": 21.3, "marketCap": "3.7L Cr"},
    {"symbol": "LT", "name": "Larsen & Toubro", "sector": "Infrastructure", "price": 3456.7, "change": 1.8, "pe": 34.5, "marketCap": "4.8L Cr"},
    {"symbol": "WIPRO", "name": "Wipro", "sector": "IT", "price": 467.85, "change": -0.2, "pe": 22.4, "marketCap": "2.4L Cr"},
    {"symbol": "AXISBANK", "name": "Axis Bank", "sector": "Banking", "price": 1123.4, "change": 1.3, "pe": 14.8, "marketCap": "3.5L Cr"},
    {"symbol": "ADANIENT", "name": "Adani Enterprises", "sector": "Conglomerate", "price": 2890.15, "change": 3.2, "pe": 78.9, "marketCap": "3.3L Cr"},
    {"symbol": "TATAMOTORS", "name": "Tata Motors", "sector": "Automobile", "price": 945.6, "change": 2.5, "pe": 8.7, "marketCap": "3.5L Cr"},
]


async def fetch_nse_quotes():
    symbols = ",".join(m["yahoo_symbol"] for m in NSE_STOCK_META)
    url = f"https://query1.finance.yahoo.com/v7/finance/quote?symbols={symbols}"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.get(url, headers={"User-Agent": "Mozilla/5.0 (compatible; PensiveApp/1.0)"})
            if r.status_code != 200:
                return None
            data = r.json()
            result = data.get("quoteResponse", {}).get("result")
            return result if isinstance(result, list) else None
    except Exception:
        return None
