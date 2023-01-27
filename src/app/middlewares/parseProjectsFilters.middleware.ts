import { Request, Response } from 'express';

export interface IProjectFilters {
  forumLegislativ?: string[];
}

export async function parseProjectsFilters(request: Request, response: Response, next: () => void) {
  let forumLegislativ: string[];

  if (Array.isArray(request.query.forumLegislativ)) {
    forumLegislativ = <string[]>request.query.forumLegislativ;
  } else if (typeof request.query.forumLegislativ === 'string') {
    forumLegislativ = [request.query.forumLegislativ];
  } else {
    forumLegislativ = request.query.forumLegislativ = [];
  }

  const projectFilters: IProjectFilters = {
    forumLegislativ,
  };

  request.projectsFilters = projectFilters;

  next();
}
