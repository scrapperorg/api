import { injectable } from 'inversify';
import { writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';

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

  // download(path: string): any {}
}
