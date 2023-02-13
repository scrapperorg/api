import { Exception, HttpStatus, statusMap } from '@lib';
import { TYPES } from '@server/types';
import { isAuthenticated } from '@middlewares/isAuthenticated.middleware';
import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { AttachmentService } from '@services/Attachment.service';

@injectable()
export class AttachmentController {
  public router: Router = Router();
  constructor(
    @inject(TYPES.ATTACHMENT_SERVICE) private readonly attachmentService: AttachmentService,
  ) {
    this.router.get('/download/:id', async (req: Request, res: Response) => {
      const { id } = req.params;

      if (id === undefined) {
        return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Attachment id missing' });
      }

      try {
        const { attachment, buffer, fileType } = await this.attachmentService.getAttachmentFile(id);

        if (fileType) {
          res.setHeader('Content-Type', fileType.mime);
        }
        res.setHeader('Content-Disposition', `attachment; filename=${attachment.name}`);
        res.setHeader('Content-Length', buffer.length);

        return res.send(buffer);
      } catch (error: any) {
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });
  }
}
