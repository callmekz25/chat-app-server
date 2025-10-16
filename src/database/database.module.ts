import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const user = config.get<string>('MONGO_ROOT_USER');
        const pass = config.get<string>('MONGO_ROOT_PASSWORD');
        const host = config.get<string>('MONGO_HOST');
        const port = config.get<string>('MONGO_PORT');
        const db = config.get<string>('MONGO_DB');

        const uri = `mongodb://${user}:${pass}@${host}:${port}/${db}?authSource=admin`;

        return { uri };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
