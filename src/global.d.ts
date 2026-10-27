import { JwtPayload } from './modules/auth/jwt.strategy.ts';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload; // 或者使用 Partial<User>，取决于实际注入的对象结构
    }
  }
}
