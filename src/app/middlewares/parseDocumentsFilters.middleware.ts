import { Request, Response } from 'express';

export interface IDocumentsFilters {
  sourcesOfInterest?: string[];
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
  };

  request.documentsFilters = documentsFilters;

  next();
}
