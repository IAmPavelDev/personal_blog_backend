import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { LoginGuard } from './login.guard';

@Module({
    imports: [UsersModule],
    providers: [LoginGuard],
    exports: [LoginGuard],
})
export class AuthModule {}
