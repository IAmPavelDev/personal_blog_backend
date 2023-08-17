import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from './posts/Post.module';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import * as dotenv from 'dotenv';
import { TagsModule } from './tags/Tags.module';

dotenv.config();
@Module({
    imports: [
        MongooseModule.forRoot(process.env.DB_CONNECTION),
        PostsModule,
        UsersModule,
        TagsModule,
    ],
    providers: [AppService],
})
export class AppModule {}
