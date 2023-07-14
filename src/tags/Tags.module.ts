import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagsController } from './Tags.controller';
import { TagsRepository } from './Tags.repository';
import { TagsService } from './Tags.service';
import { AuthModule } from 'src/auth/Auth.module';
import { UsersModule } from 'src/users/users.module';
import { Tag, TagSchema } from '../Schemas/Tag.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
        AuthModule,
        UsersModule,
    ],
    controllers: [TagsController],
    providers: [TagsService, TagsRepository],
})
export class TagsModule {}
