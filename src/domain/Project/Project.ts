export interface IProjectProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  presentsInterest: boolean;
}

export class Project {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  presentsInterest: boolean;

  private constructor(props: IProjectProps) {
    this.id = props.id;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.title = props.title;
    this.presentsInterest = props.presentsInterest;
  }

  public static create(props: IProjectProps): Project {
    return new Project(props);
  }
}
