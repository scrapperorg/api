import { Collection, OptionalProps } from '@mikro-orm/core';
import { Attachment, Document } from '..';
import { BaseEntity } from '../BaseEntity/BaseEntity';

export interface IProjectFiltersProps {
  forumLegislativ?: string[];
}

export interface IProjectProps {
  title: string;

  presentsInterest?: boolean;

  documents?: Collection<Document>;
  publicationDate?: string;
  url?: string;

  numarInregistrareSenat?: string;
  numarInregistrareGuvern?: string;
  numarInregistrareCDep?: string;
  proceduraLegislativa?: string;
  cameraDecizionala?: string;
  termenAdoptare?: string;
  tipInitiativa?: string;
  caracter?: string;
  esteProceduraDeUrgenta?: boolean;
  stadiu?: string;
  initiator?: string;
  consultati?: string;
  source?: string;
  attachments?: Collection<Attachment>;
}

export class Project extends BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt' | 'esteProceduraDeUrgenta' | 'presentsInterest';

  title: string;

  presentsInterest = false;

  documents?: Collection<Document>;

  publicationDate?: string;

  url?: string;

  numarInregistrareSenat?: string;
  numarInregistrareGuvern?: string;
  numarInregistrareCDep?: string;
  proceduraLegislativa?: string;
  cameraDecizionala?: string;
  termenAdoptare?: string;
  tipInitiativa?: string;
  caracter?: string;
  esteProceduraDeUrgenta = false;
  stadiu?: string;
  initiator?: string;
  consultati?: string;
  source?: string;

  attachments?: Collection<Attachment>;

  constructor(props: IProjectProps) {
    super();
    this.title = props.title;

    if (typeof props.presentsInterest === 'boolean') this.presentsInterest = props.presentsInterest;

    if (props.numarInregistrareSenat !== null)
      this.numarInregistrareSenat = props.numarInregistrareSenat;

    if (props.numarInregistrareGuvern !== null)
      this.numarInregistrareGuvern = props.numarInregistrareGuvern;

    if (props.numarInregistrareCDep !== null)
      this.numarInregistrareCDep = props.numarInregistrareCDep;

    if (props.proceduraLegislativa !== null) this.proceduraLegislativa = props.proceduraLegislativa;

    if (props.cameraDecizionala !== null) this.cameraDecizionala = props.cameraDecizionala;

    if (props.termenAdoptare !== null) this.termenAdoptare = props.termenAdoptare;

    if (props.tipInitiativa !== null) this.tipInitiativa = props.tipInitiativa;

    if (props.caracter !== null) this.caracter = props.caracter;

    if (typeof props.esteProceduraDeUrgenta === 'boolean')
      this.esteProceduraDeUrgenta = props.esteProceduraDeUrgenta;

    if (props.stadiu !== null) this.stadiu = props.stadiu;

    if (props.initiator !== null) this.initiator = props.initiator;

    if (props.consultati !== null) this.consultati = props.consultati;

    if (props.source !== null) this.source = props.source;
  }

  addAttachment(attachment: Attachment): void {
    if (this.attachments) {
      this.attachments.add(attachment);
    } else {
      // TODO change this to not be collection
      this.attachments = new Collection<Attachment>(attachment);
    }
  }
}
