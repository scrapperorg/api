import {
  assignResponsibleSchema,
  setDeadlineSchema,
  updateSchema,
  updateAnalysisSchema,
  searchContentSchema,
  setStatusSchema,
  setDecisionSchema,
} from './validationSchemas/Document';
import { Exception, HttpStatus, statusMap } from '@lib';
import { TYPES } from '@server/types';
import { DocumentService } from '@services';
import { isAuthenticated } from '@middlewares/isAuthenticated.middleware';
import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { parseDocumentsFilters } from '@middlewares/parseDocumentsFilters.middleware';
import { isAuthenticatedOrTrustedSource } from '@middlewares/isAuthenticatedOrTrustedSource.middleware';
import { isTrustedSourceMiddleware } from '@middlewares/isTrustedSource.middleware';
import { hasRoleAtLeast } from '@middlewares/hasRole.middleware';
import { createSchema } from '@controllers/validationSchemas/Document';
import { Role } from '@domain/User';
import multer from 'multer';
import { KeywordService } from '@services/Keyword.service';

const m = multer();

@injectable()
export class DocumentController {
  public router: Router = Router();
  constructor(
    @inject(TYPES.DOCUMENT_SERVICE) private readonly documentService: DocumentService,
    @inject(TYPES.KEYWORD_SERVICE) private readonly keywordService: KeywordService,
  ) {
    this.router.get(
      '/',
      isAuthenticatedOrTrustedSource,
      parseDocumentsFilters,
      async (req: Request, res: Response) => {
        try {
          const page: number = typeof req.query.page === 'string' ? parseInt(req.query.page) : 0;

          const pageSize: number =
            typeof req.query.pageSize === 'string' ? parseInt(req.query.pageSize) : 10;

          const filters = req.documentsFilters ?? {};

          const documents = await this.documentService.getAll(filters, page, pageSize);

          const withHash = true;
          const [keywords, keywordsHash] = await this.keywordService.getAll(withHash);

          res.status(200).send({ keywordsHash, keywords, documents });
        } catch (error: any) {
          const errorType: Exception = error.constructor.name;
          return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        }
      },
    );

    this.router.get('/:id', isAuthenticatedOrTrustedSource, async (req: Request, res: Response) => {
      try {
        const document = await this.documentService.getById(req.params.id);
        return res.status(HttpStatus.OK).json(document);
      } catch (error: any) {
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });

    this.router.post('/', isTrustedSourceMiddleware, async (req: Request, res: Response) => {
      try {
        await createSchema.validateAsync(req.body);
        const document = await this.documentService.createDocument(req.body);
        return res.status(HttpStatus.OK).json(document);
      } catch (error: any) {
        console.log(error);
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });

    this.router.put('/:id', isAuthenticatedOrTrustedSource, async (req: Request, res: Response) => {
      try {
        await updateSchema.validateAsync(req.body);
        const document = await this.documentService.updateDocument(req.params.id, req.body);
        return res.status(HttpStatus.OK).json(document);
      } catch (error: any) {
        console.log(error);
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });

    this.router.post(
      '/assign-responsible',
      isAuthenticated,
      hasRoleAtLeast(Role.LSS),
      async (req: Request, res: Response) => {
        try {
          await assignResponsibleSchema.validateAsync(req.body);
        } catch (err: any) {
          const error: Error = err;
          return res.status(statusMap[Exception.INVALID]).json(error.message);
        }

        const { documentId, userId } = req.body;

        try {
          const document = await documentService.assignResponsible(documentId, userId);

          return res.status(200).json(document);
        } catch (err: any) {
          console.log(err);
          const errorType: Exception = err.constructor.name;
          return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(err);
        }
      },
    );

    this.router.post(
      '/set-status',
      isAuthenticated,
      hasRoleAtLeast(Role.LSS),
      async (req: Request, res: Response) => {
        try {
          await setStatusSchema.validateAsync(req.body);
        } catch (err: any) {
          const error: Error = err;
          return res.status(statusMap[Exception.INVALID]).json(error.message);
        }
        const { documentId, status } = req.body;

        try {
          const document = await documentService.setStatus(documentId, status);

          return res.status(200).json(document);
        } catch (err: any) {
          console.log(err);
          const errorType: Exception = err.constructor.name;
          return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(err);
        }
      },
    );

    this.router.post(
      '/set-decision',
      isAuthenticated,
      hasRoleAtLeast(Role.LSS),
      async (req: Request, res: Response) => {
        try {
          await setDecisionSchema.validateAsync(req.body);
        } catch (err: any) {
          const error: Error = err;
          return res.status(statusMap[Exception.INVALID]).json(error.message);
        }
        const { documentId, decision } = req.body;

        try {
          const document = await documentService.setDecision(documentId, decision);

          return res.status(200).json(document);
        } catch (err: any) {
          console.log(err);
          const errorType: Exception = err.constructor.name;
          return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(err);
        }
      },
    );

    this.router.post('/set-deadline', isAuthenticated, async (req: Request, res: Response) => {
      try {
        await setDeadlineSchema.validateAsync(req.body);
      } catch (err: any) {
        const error: Error = err;
        return res.status(statusMap[Exception.INVALID]).json(error.message);
      }

      const { documentId, date } = req.body;

      try {
        const document = await documentService.setDeadline(documentId, date);

        return res.status(200).json(document);
      } catch (err: any) {
        console.log(err);
        const errorType: Exception = err.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(err);
      }
    });

    this.router.post(
      '/update-document-analysis',
      isAuthenticated,
      async (req: Request, res: Response) => {
        try {
          await updateAnalysisSchema.validateAsync(req.body);
          const { documentId } = req.body;
          const document = await documentService.updateAnalysis(documentId, req.body);
          return res.status(HttpStatus.OK).json(document);
        } catch (error: any) {
          console.log(error);
          const errorType: Exception = error.constructor.name;
          return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        }
      },
    );

    this.router.delete(
      '/:documentId/attachment/:attachmentId',
      isAuthenticated,
      async (req: Request, res: Response) => {
        const { documentId, attachmentId } = req.params;

        const noDocumentId = documentId === '' || documentId === undefined;
        const noAttachmentId = documentId === '' || documentId === undefined;

        if (noDocumentId || noAttachmentId) {
          return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Document id missing' });
        }

        try {
          const document = await this.documentService.deleteAttachment(documentId, attachmentId);
          return res.status(HttpStatus.OK).json(document);
        } catch (error: any) {
          const errorType: Exception = error.constructor.name;
          return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        }
      },
    );

    this.router.post(
      '/upload/:documentId',
      m.single('attachment'),
      async (req: Request, res: Response) => {
        const params = req.params;

        if (params.documentId === '' || params.documentId === undefined) {
          return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Document id missing' });
        }

        if (!req.file) {
          return res.status(HttpStatus.BAD_REQUEST).json({ error: 'File missing' });
        }

        try {
          const document = await this.documentService.addAttachment(params.documentId, req.file);
          return res.status(HttpStatus.OK).json(document);
        } catch (error: any) {
          const errorType: Exception = error.constructor.name;
          return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        }
      },
    );

    this.router.post('/search', isAuthenticated, async (req: Request, res: Response) => {
      try {
        await searchContentSchema.validateAsync(req.body);
      } catch (err: any) {
        console.log(err);
        const error: Error = err;
        return res.status(statusMap[Exception.INVALID]).json(error.message);
      }

      try {
        const documents = await this.documentService.search(req.body);
        return res.status(HttpStatus.OK).json(documents);
      } catch (error: any) {
        console.log(error);
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });

    this.router.get('/download-highlight-pdf/:id', async (req: Request, res: Response) => {
      const { id } = req.params;

      if (id === undefined) {
        return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Attachment id missing' });
      }

      try {
        const { document, buffer, fileType } = await this.documentService.getHighlightPdf(id);

        if (fileType) {
          res.setHeader('Content-Type', fileType.mime);
        }
        res.setHeader(
          'Content-Disposition',
          `attachment; filename=${document.id + '_highlight.pdf'}`,
        );
        res.setHeader('Content-Length', buffer.length);
        return res.send(buffer);
      } catch (error: any) {
        console.log(error);
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });

    this.router.get('/download-ocr-pdf/:id', async (req: Request, res: Response) => {
      const { id } = req.params;

      if (id === undefined) {
        return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Attachment id missing' });
      }

      try {
        const { document, buffer, fileType } = await this.documentService.getOcrPdf(id);

        if (fileType) {
          res.setHeader('Content-Type', fileType.mime);
        }
        res.setHeader('Content-Disposition', `attachment; filename=${document.id + '_ocr.pdf'}`);
        res.setHeader('Content-Length', buffer.length);
        return res.send(buffer);
      } catch (error: any) {
        console.log(error);
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });

    this.router.get('/download-pdf/:id', async (req: Request, res: Response) => {
      const { id } = req.params;

      if (id === undefined) {
        return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Attachment id missing' });
      }

      try {
        const { document, buffer, fileType } = await this.documentService.getRawPdf(id);
        const fileName = document.link?.split('/').pop();

        if (fileType) {
          res.setHeader('Content-Type', fileType.mime);
        }
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.setHeader('Content-Length', buffer.length);
        return res.send(buffer);
      } catch (error: any) {
        console.log(error);
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });
  }
}
