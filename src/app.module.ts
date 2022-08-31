import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from 'pages/Post.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsController } from 'pages/Post.controller';
import { PostService } from 'pages/Post.service';

@Module({
    imports: [
        MongooseModule.forRoot(
            'mongodb+srv://IAmPavel:28NwUWgjK5KSyNH@personalblog.fi4k9ca.mongodb.net/?retryWrites=true&w=majority',
        ),
        PostsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
