import { Request, Response } from 'express';

export interface IDocumentsFilters {
  sourcesOfInterest?: string[];
  title?: string;
  link?: string;
  project?: string;
  processingStatus?: string;
}

export async function parseDocumentsFilters(
  request: Request,
  response: Response,
  next: () => void,
) {
  let sourcesOfInterest: string[];

  if (Array.isArray(request.query.sourcesOfInterest)) {
    sourcesOfInterest = <string[]>request.query.sourcesOfInterest;
  } else if (typeof request.query.sourcesOfInterest === 'string') {
    sourcesOfInterest = [request.query.sourcesOfInterest];
  } else {
    sourcesOfInterest = request.query.sourcesOfInterest = [];
  }

  const documentsFilters: IDocumentsFilters = {
    sourcesOfInterest,
    title: request.query.title as string,
    link: request.query.link as string,
    project: request.query.project as string,
    processingStatus: request.query.processingStatus as string,
  };

  request.documentsFilters = documentsFilters;

  next();
}
