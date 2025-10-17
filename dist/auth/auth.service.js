"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
function parseExpires(val, fallback) {
    if (typeof val === 'number')
        return val;
    if (typeof val === 'string' && /^\d+[smhd]?$/.test(val))
        return val;
    return fallback;
}
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    prisma;
    jwt;
    cfg;
    constructor(prisma, jwt, cfg) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.cfg = cfg;
    }
    async register(dto) {
        const exists = await this.prisma.user.findUnique({
            where: { email: dto.email },
            select: { id: true },
        });
        if (exists)
            throw new common_1.ConflictException('Email déjà utilisé');
        const saltRounds = this.cfg.get('BCRYPT_SALT_ROUNDS') !== undefined
            ? Number(this.cfg.get('BCRYPT_SALT_ROUNDS'))
            : 10;
        const hashed = await bcrypt.hash(dto.password, saltRounds);
        const user = await this.prisma.user.create({
            data: { email: dto.email, name: dto.name, password: hashed },
            select: { id: true, email: true },
        });
        return this.tokens(user.id, user.email);
    }
    async login(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, password: true },
        });
        if (!user)
            throw new common_1.UnauthorizedException('Identifiants invalides');
        if (!user.password)
            throw new common_1.UnauthorizedException('Identifiants invalides');
        const ok = await bcrypt.compare(password, user.password);
        if (!ok)
            throw new common_1.UnauthorizedException('Identifiants invalides');
        return this.tokens(user.id, user.email);
    }
    async tokens(sub, email) {
        const payload = { sub, email };
        const jwtSecret = this.cfg.get('JWT_SECRET');
        if (!jwtSecret)
            throw new common_1.InternalServerErrorException('JWT_SECRET non configuré');
        const accessExpires = parseExpires(this.cfg.get('JWT_EXPIRES'), '15m');
        const refreshExpires = parseExpires(this.cfg.get('JWT_REFRESH_EXPIRES'), this.cfg.get('JWT_EXPIRES') ?? '7d');
        const access = await this.jwt.signAsync(payload, {
            secret: jwtSecret,
            expiresIn: accessExpires,
        });
        const refreshSecret = this.cfg.get('JWT_REFRESH_SECRET') ?? jwtSecret;
        const refresh = await this.jwt.signAsync(payload, {
            secret: refreshSecret,
            expiresIn: refreshExpires,
        });
        return { access, refresh };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map