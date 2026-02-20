import json

from openai import AsyncOpenAI

from app.config import get_settings
from app.models.schemas import AdvisorRequest


def _user_content(body: AdvisorRequest) -> str:
    budget = body.budget or "Not specified"
    risk = body.riskLevel or "Moderate"
    default = (
        f"Based on the current market data, suggest an investment strategy for a budget of Rs.{budget} "
        f"with {risk} risk tolerance. Recommend specific stocks with allocation percentages."
    )
    if not body.messages or len(body.messages) == 0:
        return default
    last = body.messages[-1]
    if not isinstance(last, dict) or last.get("role") != "user":
        return default
    part = last.get("content") or last.get("parts")
    if isinstance(part, list):
        for p in part:
            if isinstance(p, dict) and p.get("type") == "text":
                return p.get("text", default)
    if isinstance(part, str):
        return part
    return default


class AdvisorService:
    @classmethod
    async def stream_advice(cls, body: AdvisorRequest):
        settings = get_settings()
        api_key = settings.openai_api_key
        if not api_key or not api_key.strip():
            raise ValueError(
                "OpenAI API key is not configured. Set OPENAI_API_KEY in your environment."
            )
        stocks = body.stocks or []
        budget = body.budget or "Not specified"
        risk = body.riskLevel or "Moderate"
        stock_context = "\n".join(
            f'{s.get("symbol")} ({s.get("name")}): Rs.{s.get("price")}, Change: {s.get("change")}%, '
            f'P/E: {s.get("pe")}, Sector: {s.get("sector")}'
            for s in stocks
        )
        system = f"""You are an expert Indian stock market investment advisor. You provide analysis based on fundamental and technical indicators.

Current Indian Stock Market Data:
{stock_context or "No stock data available"}

User's Investment Budget: Rs.{budget}
Risk Tolerance: {risk}

Guidelines:
- Always recommend diversification across sectors
- Consider P/E ratios, market cap, and recent performance
- Provide specific allocation percentages
- Mention risks and disclaimers
- Use Indian Rupee (Rs.) for all amounts
- Be specific about which stocks to buy and why
- Always add a disclaimer that this is for educational purposes only

Output format (strict):
- Respond ONLY in valid Markdown. Your entire response will be rendered as Markdown.
- Use Markdown headers (##, ###) for sections, bullet points for lists.
- For the investment summary, use a Markdown table with columns such as: Stock Name, P/E Ratio, Allocation, Amount to Invest (Rs.).
- Use pipe (|) and hyphens for table borders. Example:
  | Stock Name | P/E Ratio | Allocation | Amount to Invest |
  | :--------- | :-------: | :--------: | ----------------: |
  | HDFC Bank  | 19.2      | 25%        | Rs.25000         |
- Do not use raw HTML. Use only standard Markdown so the output does not break."""
        user_content = _user_content(body)
        client = AsyncOpenAI(api_key=api_key)
        stream = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user_content},
            ],
            stream=True,
        )
        async for chunk in stream:
            if chunk.choices and chunk.choices[0].delta.content:
                text = chunk.choices[0].delta.content
                yield f"data: {json.dumps([{'type': 'text-delta', 'textDelta': text}])}\n\n"
        yield "data: [DONE]\n\n"
