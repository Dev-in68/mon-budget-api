import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    health(): {
        status: string;
        message: string;
        timestamp: string;
    };
    register(dto: RegisterDto): Promise<{
        access: string;
        refresh: string;
    }>;
    login(dto: LoginDto): Promise<{
        access: string;
        refresh: string;
    }>;
}
