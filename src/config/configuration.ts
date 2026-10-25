import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as yaml from 'js-yaml';
import { configScheme } from './config.scheme.ts';

const YAML_CONFIG_FILENAME = 'config.yml';

export default () => {
  const raw = yaml.load(
    readFileSync(join(import.meta.dirname, YAML_CONFIG_FILENAME), 'utf8'),
  );
  const config = configScheme.parse(raw);
  // console.log(config);
  return config;
};
