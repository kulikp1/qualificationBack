import fs from 'node:fs/promises';

export const createDirIfDoesNotExist = async (url) => {
  try {
    await fs.access(url);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(url);
    }
  }
};