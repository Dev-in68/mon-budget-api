import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();

    const safeDisconnect = async () => {
      try {
        await this.$disconnect();
      } catch (err) {
        // ignore
      }
    };

    // utiliser process.once pour éviter d'ajouter plusieurs handlers lors du reload
    process.once('beforeExit', () => {
      void safeDisconnect();
    });
    process.once('SIGINT', () => {
      void safeDisconnect();
      // préserver comportement défaut (exit)
      process.exit(0);
    });
    process.once('SIGTERM', () => {
      void safeDisconnect();
      process.exit(0);
    });
  }
}
