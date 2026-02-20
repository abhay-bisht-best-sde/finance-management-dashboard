import logging
from functools import lru_cache

from prisma import Prisma

logger = logging.getLogger(__name__)


class PrismaClient:
    _instance: Prisma | None = None

    @classmethod
    def get_client(cls) -> Prisma:
        if cls._instance is None:
            logger.debug("Creating new Prisma client instance (singleton)")
            cls._instance = Prisma()
        return cls._instance

    @classmethod
    async def connect(cls) -> None:
        client = cls.get_client()
        if not client.is_connected():
            logger.debug("Connecting to database...")
            await client.connect()
            logger.debug("Database connection successful")

    @classmethod
    async def disconnect(cls) -> None:
        if cls._instance is not None:
            if cls._instance.is_connected():
                logger.debug("Disconnecting from database...")
                await cls._instance.disconnect()
            cls._instance = None
            logger.debug("Database disconnected")


@lru_cache(maxsize=1)
def get_db() -> Prisma:
    return PrismaClient.get_client()