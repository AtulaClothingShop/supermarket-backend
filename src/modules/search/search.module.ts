import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { IConfig } from 'config';
import { ConfigModule } from '../config/config.module';
import { CONFIG } from '../config/config.service';

@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [CONFIG],
      useFactory: async (config: IConfig) => ({
        node: config.get('elastic_search.node'),
        auth: {
          username: config.get('elastic_search.username'),
          password: config.get('elastic_search.password'),
        },
      }),
    }),
  ],
  exports: [ElasticsearchModule],
})
export class SearchModule {}
