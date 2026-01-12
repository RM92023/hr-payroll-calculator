import { Global, Module, Provider } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { MockPrismaService } from './mock-prisma.service';

const useMock =
  process.env.NODE_ENV === 'test' || process.env.USE_MOCK_PRISMA === 'true';

const prismaProvider: Provider = {
  provide: PrismaService,
  useClass: useMock ? MockPrismaService : PrismaService,
};

@Global()
@Module({
  providers: [prismaProvider],
  exports: [prismaProvider],
})
export class PrismaModule {}
