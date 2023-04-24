export interface ICreateKeywordIncomingDTO {
  name: string;
}

export interface IUpdateKeywordIncomingDTO {
  id: string;
  name: string;
}

export interface IDeleteKeywordIncomingDTO {
  id: string;
}

export interface IKeywordOutgoingDTO {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
}
