import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { StorageRepository } from './Storage.repository';
import { StorageService } from './Storage.service';

@Module({
    providers: [StorageService, StorageRepository, Array],
    exports: [StorageService],
})
export class StorageModule {}
