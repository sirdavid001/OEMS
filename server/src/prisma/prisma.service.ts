import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const MAX_DB_CONNECT_RETRIES = 12;
const DB_CONNECT_RETRY_DELAY_MS = 5000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableDatabaseStartupError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /starting up|ECONNREFUSED|timeout|terminating connection|Connection terminated/i.test(message);
}

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({ adapter });
  }

  async onModuleInit() {
    for (let attempt = 1; attempt <= MAX_DB_CONNECT_RETRIES; attempt += 1) {
      try {
        await this.$connect();
        return;
      } catch (error) {
        if (!isRetryableDatabaseStartupError(error) || attempt === MAX_DB_CONNECT_RETRIES) {
          throw error;
        }

        this.logger.warn(
          `Database not ready yet. Retrying connection (${attempt}/${MAX_DB_CONNECT_RETRIES}) in ${DB_CONNECT_RETRY_DELAY_MS / 1000}s...`,
        );
        await sleep(DB_CONNECT_RETRY_DELAY_MS);
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
