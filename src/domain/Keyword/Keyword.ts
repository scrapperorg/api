import { OptionalProps } from '@mikro-orm/core';
import { BaseEntity } from '../BaseEntity/BaseEntity';

export interface IKeywordProps {
  name: string;
}

export class Keyword extends BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  name: string;

  constructor(props: IKeywordProps) {
    super();
    this.name = props.name;
  }
}
