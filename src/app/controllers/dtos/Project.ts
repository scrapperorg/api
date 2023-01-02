export interface IProjectIncomingDTO {
  title: string;
}

export interface IProjectOutgoingDTO {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  presentsInterest: boolean;

  numarInregistrareSenat?: string;
  numarInregistrareGuvern?: string;
  proceduraLegislativa?: string;
  cameraDecizionala?: string;
  termenAdoptare?: string;
  tipInitiativa?: string;
  caracter?: string;
  esteProceduraDeUrgenta: boolean;
  stadiu?: string;
  initiator?: string;
  consultati?: string;

  attachments: string[];
}
