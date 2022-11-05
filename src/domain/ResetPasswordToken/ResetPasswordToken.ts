export interface IResetPasswordTokenProps {
  id?: string;
  userId: string;
  token: string;
  expirationDate: Date;
}

export class ResetPasswordToken {
  id: string;
  userId: string;
  token: string;
  expirationDate: Date;
  private constructor(props: IResetPasswordTokenProps) {
    this.id = props.id ?? 'generateId?';
    this.userId = props.userId;
    this.token = props.token;
    this.expirationDate = props.expirationDate;
  }

  public static create(props: IResetPasswordTokenProps) {
    return new ResetPasswordToken(props);
  }
}
