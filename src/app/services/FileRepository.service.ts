// import { NoSuchElementException } from './../../lib/exceptions/NoSuchElement.exception';
// import { IAllDocumentsOutgoingDTO, IDocumentOutgoingDTO } from '@controllers/dtos';
// import { IDocumentRepository } from '@domain/Document';
// import { DocumentMap } from '@mappers';
// import { TYPES } from '@server/types';
// import { inject, injectable } from 'inversify';
// import { IDocumentsFilters } from '@middlewares/parseDocumentsFilters.middleware';
// import { Router } from 'express';
// import express from 'express';

// @injectable()
// export class FileRepository {
//   constructor() {}

//   async getAll(
//     documentsFilters: IDocumentsFilters,
//     page: number,
//     pageSize: number,
//   ): Promise<IAllDocumentsOutgoingDTO> {
//     const offset = page * pageSize;

//     const { entries, count } = await this.repository.getAll(
//       documentsFilters.sourcesOfInterest,
//       offset,
//       pageSize,
//     );
//     const dtoDocuments = entries.map((entry) => this.mapper.toDTO(entry));
//     return {
//       totalNumberOfResults: count,
//       results: dtoDocuments,
//     };
//   }

//   async getById(id: string): Promise<IDocumentOutgoingDTO | null> {
//     const entry = await this.repository.getById(id);
//     if (!entry) {
//       throw new NoSuchElementException('document not found');
//     }
//     return this.mapper.toDTO(entry);
//   }

//   // async attachDocument() {
//   //   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   //   const multer = require('multer');
//   //   const router = Router();
//   //   const upload = multer({ dest: 'uploads/' });
//   //   const express = require('express');
//   //   const app = express();
//   //   app.use(upload.single('file'));
//   //   router.post('/upload', upload.single('file'), (req, res) => {
//   //     try {
//   //       res.send({ file: req.file });
//   //     } catch (err) {
//   //       console.error(err);
//   //       res.status(500).send(err);
//   //     }
//   //   });
//   // }
// }
