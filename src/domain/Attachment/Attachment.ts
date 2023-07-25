import { OptionalProps } from '@mikro-orm/core';
import { BaseEntity } from '../BaseEntity/BaseEntity';
import { Document, Project } from '@domain';

export interface IAttachmentProps {
  name: string;
  size: number;
  path: string;
  document?: Document;
  project?: Project;
}

export class Attachment extends BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt' | 'document';

  name: string;

  size: number;
  path: string;

  document?: Document;

  project?: Project;

  constructor(props: IAttachmentProps) {
    super();
    this.name = props.name;
    this.size = props.size;
    this.path = props.path;
    this.document = props.document;
    this.project = props.project;
  }
}
