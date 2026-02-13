import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { dataSourceOption } from './database/data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TodoModule } from './modules/todo/todo.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short', // Prevents rapid-fire botting
          ttl: 1000,     // 1 second
          limit: 3,
        },
        {
          name: 'medium', // Standard browsing speed
          ttl: 60000,    // 1 minute
          limit: 60,
        },
        {
          name: 'long',   // Overall daily safety net
          ttl: 86400000, // 1 day
          limit: 2000,
        },
      ],
    }),
    TypeOrmModule.forRoot(dataSourceOption),
    AuthModule, UsersModule, TodoModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AppService],
})
export class AppModule { }
