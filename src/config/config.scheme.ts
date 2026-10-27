import { z } from 'zod';

export const configScheme = z.object({
  port: z.number().int().positive().default(3000),
  dataSource: z.object({
    host: z.string().default('localhost'),
    port: z.number().int().positive().default(3306),
    username: z.string().default('root'),
    password: z.string().default('123456'),
    database: z.string(),
  }),
  swagger: z.object({
    enabled: z.boolean().default(false),
  }),
  redis: z.object({
    host: z.string().default('localhost'),
    port: z.number().int().positive().default(6379),
    db: z.number().int().min(0).default(0),
    password: z.string(),
  }),
  mail: z.object({
    host: z.string(),
    port: z.number().int().positive(),
    secure: z.boolean().default(true),
    user: z.email(),
    password: z.string(),
  }),
  jwt: z.object({
    algorithm: z.string().default('HS256'),
    audience: z.string().default('localhost'),
    issuer: z.string().default('localhost'),
    secret: z.string().min(8).default('initial_jwt_secret'),
    refreshTokenSecret: z.string().min(8).default('initial_refresh_secret'),
    // 单位：分钟
    expiresIn: z.number().int().positive().default(60),
    refreshTokenExpiresIn: z.number().int().positive().default(10080),
  }),
});

export type ConfigType = z.infer<typeof configScheme>;
