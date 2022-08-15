import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entity
import Address from 'src/entities/address.entity';
import Role from 'src/entities/role.entity';
import User from 'src/entities/user.entity';
import ProductCode from 'src/entities/productCode.entity';

// Module
import { ConfigModule } from '../config/config.module';
import { DatabaseModule } from '../database/database.module';

// Service
import { SeederService } from './seeder.service';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    TypeOrmModule.forFeature([User, Role, Address, ProductCode]),
  ],
  providers: [SeederService, Logger],
})
export class SeederModule {}
