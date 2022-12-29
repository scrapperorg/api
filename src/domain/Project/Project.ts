export interface IProjectProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  presentsInterest: boolean;

  numarInregistrareSenat: string | null;
  numarInregistrareGuvern: string | null;
  proceduraLegislativa: string | null;
  cameraDecizionala: string | null;
  termenAdoptare: string | null;
  tipInitiativa: string | null;
  caracter: string | null;
  esteProceduraDeUrgenta: boolean | null;
  stadiu: string | null;
  initiator: string | null;
  consultati: string | null;

  attachments: string[];
}

export class Project {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  presentsInterest: boolean;

  numarInregistrareSenat: string | undefined;
  numarInregistrareGuvern: string | undefined;
  proceduraLegislativa: string | undefined;
  cameraDecizionala: string | undefined;
  termenAdoptare: string | undefined;
  tipInitiativa: string | undefined;
  caracter: string | undefined;
  esteProceduraDeUrgenta: boolean | undefined;
  stadiu: string | undefined;
  initiator: string | undefined;
  consultati: string | undefined;

  attachments: string[];

  private constructor(props: IProjectProps) {
    this.id = props.id;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.title = props.title;
    this.presentsInterest = props.presentsInterest;

    if (props.numarInregistrareSenat !== null)
      this.numarInregistrareSenat = props.numarInregistrareSenat;

    if (props.numarInregistrareGuvern !== null)
      this.numarInregistrareGuvern = props.numarInregistrareGuvern;

    if (props.proceduraLegislativa !== null) this.proceduraLegislativa = props.proceduraLegislativa;

    if (props.cameraDecizionala !== null) this.cameraDecizionala = props.cameraDecizionala;

    if (props.termenAdoptare !== null) this.termenAdoptare = props.termenAdoptare;

    if (props.tipInitiativa !== null) this.tipInitiativa = props.tipInitiativa;

    if (props.caracter !== null) this.caracter = props.caracter;

    if (props.esteProceduraDeUrgenta !== null)
      this.esteProceduraDeUrgenta = props.esteProceduraDeUrgenta;

    if (props.stadiu !== null) this.stadiu = props.stadiu;

    if (props.initiator !== null) this.initiator = props.initiator;

    if (props.consultati !== null) this.consultati = props.consultati;

    this.attachments = props.attachments;
  }

  public static create(props: IProjectProps): Project {
    return new Project(props);
  }
}
