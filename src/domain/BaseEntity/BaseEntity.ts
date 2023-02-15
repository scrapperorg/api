import crypto from 'crypto';

interface BaseEntityProps {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(props?: BaseEntityProps) {
    const properties = props || {};
    const { id, createdAt, updatedAt } = properties;

    if (id === undefined) {
      this.id = crypto.randomUUID();
    } else {
      this.id = id;
    }

    if (createdAt === undefined) {
      this.createdAt = new Date();
    } else {
      this.createdAt = createdAt;
    }

    if (updatedAt === undefined) {
      this.updatedAt = new Date();
    } else {
      this.updatedAt = updatedAt;
    }
  }
}
