import {
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from './entity/user.entity.ts';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheKey } from '../../common/enum/cache.enum.ts';
import type { Request } from 'express';

export interface JwtPayload {
  userId: number;
  username: string;
  role: number | number[];
  expiresAt: Date;
}

export interface AuthUser extends JwtPayload {
  accessToken: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.secret'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<AuthUser> {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!token) {
      throw new UnauthorizedException('无效token');
    }
    const blackToken = await this.cacheManager.get<boolean>(
      CacheKey.BLACK_TOKEN_PREFIX + token,
    );
    if (blackToken) {
      throw new UnauthorizedException('无效token');
    }
    const user = await this.userRepository.findOne({
      where: {
        id: payload.userId,
      },
    });
    if (!user) {
      throw new UnauthorizedException('无效token');
    }
    return {
      ...payload,
      expiresAt: new Date(payload.expiresAt),
      accessToken: token,
    };
  }
}
