import { Global, Module, Provider } from '@nestjs/common';
import { PrismaService, MockPrismaService } from './prisma.service';

const useMock = process.env.NODE_ENV === 'test' || !process.env.DATABASE_URL;

const providers: Provider[] = useMock
  ? [
      {
        provide: 'PRISMA',
        useClass: MockPrismaService,
      },
    ]
  : [
      {
        provide: 'PRISMA',
        useClass: PrismaService,
      },
    ];

@Global()
@Module({
  providers,
  exports: ['PRISMA'],
})
export class PrismaModule {}
