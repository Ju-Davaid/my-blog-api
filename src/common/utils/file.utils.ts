import fs from 'fs';
import path from 'path';

/**
 * 获取目录下所有文件
 * @param dir 目录路径
 * @param list 文件列表
 * @returns 文件列表
 */
export const getAllFiles = (dir: string, list: string[] = []) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      getAllFiles(fullPath, list); // 递归
    } else if (entry.isFile()) {
      list.push(fullPath);
    }
    // 符号链接默认跳过，需要跟随就 stat 判断
  }

  return list;
};
