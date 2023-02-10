import { injectable } from 'inversify';
import { writeFile, mkdir, rm } from 'fs/promises';
import { dirname, resolve } from 'path';

@injectable()
export class FileRepositoryService {
  async upload(path: string, file: Buffer): Promise<void> {
    try {
      const dir = dirname(path);
      await mkdir(dir, { recursive: true });
      await writeFile(path, file, {});
    } catch (err) {
      throw new Error(`File could not be uploaded to path ${path}`);
    }
  }

  async delete(path: string): Promise<void> {
    try {
      await rm(resolve(path), { force: true });
    } catch (err) {
      throw new Error(`File could not be deleted from path ${path}`);
    }
  }
}
