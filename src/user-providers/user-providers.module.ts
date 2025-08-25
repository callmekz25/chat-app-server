import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProvider } from './user-providers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserProvider])],
  providers: [],
  controllers: [],
  exports: [],
})
export class UserProviderModule {}
