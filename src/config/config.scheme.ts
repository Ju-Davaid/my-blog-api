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
  mail: z.object({
    host: z.string(),
    port: z.number().int().positive(),
    secure: z.boolean().default(true),
    user: z.email(),
    password: z.string(),
  }),
});

export type ConfigType = z.infer<typeof configScheme>;
