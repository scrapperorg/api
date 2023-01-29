import { NoSuchElementException } from './../../lib/exceptions/NoSuchElement.exception';
import { IAllDocumentsOutgoingDTO, IDocumentOutgoingDTO } from '@controllers/dtos';
import { IDocumentRepository } from '@domain/Document';
import { DocumentMap } from '@mappers';
import { TYPES } from '@server/types';
import { inject, injectable } from 'inversify';
import { IDocumentsFilters } from '@middlewares/parseDocumentsFilters.middleware';
import { createWriteStream } from 'fs';
import path from 'path';
import fs from 'fs';

@injectable()
export class DocumentService {
  constructor(
    @inject(TYPES.DOCUMENT_REPOSITORY) private repository: IDocumentRepository,
    @inject(TYPES.DOCUMENT_MAP) private mapper: DocumentMap,
  ) {}

  async getAll(
    documentsFilters: IDocumentsFilters,
    page: number,
    pageSize: number,
  ): Promise<IAllDocumentsOutgoingDTO> {
    const offset = page * pageSize;

    const { entries, count } = await this.repository.getAll(
      documentsFilters.sourcesOfInterest,
      offset,
      pageSize,
    );
    const dtoDocuments = entries.map((entry) => this.mapper.toDTO(entry));
    return {
      totalNumberOfResults: count,
      results: dtoDocuments,
    };
  }

  async getById(id: string): Promise<IDocumentOutgoingDTO | null> {
    const entry = await this.repository.getById(id);
    if (!entry) {
      throw new NoSuchElementException('document not found');
    }
    return this.mapper.toDTO(entry);
  }

  async uploadDocument(file: Express.Multer.File) {
    // if (file !== '') {
    //   throw new Error('No file provided');
    // }

    // const path = 'src/temp-file-bucket/';
    // const writeStream = createWriteStream(path);
    // file.pipe(writeStream);

    // return new Promise((resolve, reject) => {
    //   file.on('end', resolve);
    //   writeStream.on('error', reject);
    // });
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    // const upload = multer({ dest: 'uploads/' });
    // app.post('/upload', upload.single('pdf'), (req: Request, res: Response) => {
    // The PDF file is available in req.file
    // You can use the fs module to save the file to a specific location on the server
    // });
    // app.use(upload.single('file'));
    // router.post('/upload', upload.single('file'), (req, res) => {
    //   try {
    //     res.send({ file: req.file });
    //   } catch (err) {
    //     console.error(err);
    //     res.status(500).send(err);
    //   }
    // });

    //   const storage = multer.diskStorage({
    //     destination: function (req: any, file: any, cb: any) {
    //       cb(null, 'src/temp-file-bucket/');
    //     },
    //     filename: function (req: any, file: any, cb: any) {
    //       cb(null, new Date().toISOString() + file.originalname);
    //     },
    //   });
    //   const fileFilter = (req: any, file: any, cb: any) => {
    //     if (file.mimetype === 'application/pdf') {
    //       cb(null, true);
    //     } else {
    //       cb(new Error('Invalid file type. Only PDFs are allowed.'), false);
    //     }
    //   };
    //   return multer({
    //     storage: storage,
    //     limits: {
    //       fileSize: 1024 * 1024 * 5,
    //     },
    //     fileFilter: fileFilter,
    //   });
    // }

    const { originalname, buffer } = file;
    const filepath = path.join(__dirname, '..', 'public', 'uploads', originalname);
    await fs.promises.writeFile(filepath, buffer);
    return filepath;
  }
}
