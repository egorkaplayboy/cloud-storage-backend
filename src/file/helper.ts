import { randomUUID } from 'crypto';

export const generateFileName = (filename: string) => {
  return `${randomUUID()}_${filename}`;
};

export const bytesToMegabytes = (bytes: number): number => {
  return bytes / (1024 * 1024);
};
