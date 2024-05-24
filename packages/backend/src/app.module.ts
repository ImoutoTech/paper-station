import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ENV_LIST } from '@/utils/const';
import { AuthGuard, BusinessException, LoggerModule } from '@reus-able/nestjs';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [...ENV_LIST],
    }),
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useFactory() {
        return new ValidationPipe({
          transform: true,
          transformOptions: {
            enableImplicitConversion: true, // 开启隐式转换
          },
          exceptionFactory: (errors) => {
            const errorProperties = errors.map((e) => e.property).join(',');
            return new BusinessException(
              `参数校验失败，请检查 ${errorProperties}`,
            );
          },
        });
      },
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
