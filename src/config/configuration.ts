import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as yaml from 'js-yaml';
import { configScheme } from './config.scheme.ts';
import TimeUtils from '../common/utils/time.utils.ts';

const YAML_CONFIG_FILENAME = 'config.yml';

export default () => {
  const raw = yaml.load(
    readFileSync(join(import.meta.dirname, YAML_CONFIG_FILENAME), 'utf8'),
  );
  const config = configScheme.parse(raw);
  // 转换为毫秒
  config.jwt.expiresIn = TimeUtils.timeStrToMilliseconds(config.jwt.expiresIn);
  config.jwt.refreshTokenExpiresIn = TimeUtils.timeStrToMilliseconds(
    config.jwt.refreshTokenExpiresIn,
  );
  return config;
};
