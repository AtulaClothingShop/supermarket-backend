import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IConfig } from 'config';
import { ConfigModule } from '../config/config.module';
import { CONFIG } from '../config/config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [CONFIG],
      useFactory: (config: IConfig) => {
        return {
          type: 'postgres',
          host: config.get('postgres.host'),
          port: config.get('postgres.port'),
          username: config.get('postgres.username'),
          password: config.get('postgres.password'),
          database: config.get('postgres.database'),
          entities: ['dist/**/*.entity.js'],
          seeds: ['src/seeding/seeds/**/*{.ts,.js}'],
          factories: ['src/seeding/factories/**/*{.ts,.js}'],
          synchronize: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
