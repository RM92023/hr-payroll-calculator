import 'dotenv/config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString)
      throw new Error('DATABASE_URL no está definido en el .env');

    super({
      adapter: new PrismaPg({ connectionString }),
      log: ['warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
