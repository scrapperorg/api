import { OptionalProps } from '@mikro-orm/core';
import { BaseEntity } from '../BaseEntity/BaseEntity';
import { Document } from '@domain';

export interface IAttachmentProps {
  name: string;
  size: number;
  path: string;
  document: Document;
}

export class Attachment extends BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt' | 'document';

  name: string;

  size: number;
  path: string;

  document?: Document;

  constructor(props: IAttachmentProps) {
    super();
    this.name = props.name;
    this.size = props.size;
    this.path = props.path;
    this.document = props.document;
  }
}
