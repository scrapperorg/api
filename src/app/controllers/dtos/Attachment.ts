export interface BaseDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface IAttachmentOutgoingDTO extends BaseDto {
  name: string;
  size: number;
  path: string;
}
