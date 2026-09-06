import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AmostraModule } from './amostra/amostra.module';
import { PacienteModule } from './paciente/paciente.module';
import { MedicoModule } from './medico/medico.module';
import { Medico } from './medico/medico.entity';
import { Paciente } from './paciente/paciente.entity';
import { Amostra } from './amostra/amostra.entity';
import { ConfigModule } from '@nestjs/config';
import { FilesModule } from './files/files.module';
import { DeletionRequest } from './admin/deletion-request.entity';
import { AdminModule } from './admin/admin.module';
import { SeedModule } from './seed/seed.module';
import { Notification } from './notifications/notification.entity';
import { NotificationModule } from './notifications/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      // DB_SSL=true (bancos em nuvem como Neon/Supabase/RDS) liga SSL.
      // DB_SSL=false (padrao, Postgres local do docker-compose) desliga SSL,
      // senao o driver tenta handshake SSL contra um Postgres que nao fala SSL
      // e a conexao nunca sobe.
      ssl:
        process.env.DB_SSL === 'true'
          ? { rejectUnauthorized: false }
          : false,
      entities: [Medico, Paciente, Amostra, DeletionRequest, Notification],
      synchronize: true,
    }),
    AuthModule,
    AmostraModule,
    PacienteModule,
    MedicoModule,
    FilesModule,
    AdminModule,
    SeedModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
