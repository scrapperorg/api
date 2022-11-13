export interface IResetPasswordTokenProps {
  id?: string;
  user: string;
  token: string;
  expirationDate: Date;
}

export class ResetPasswordToken {
  id: string;
  user: string;
  token: string;
  expirationDate: Date;
  private constructor(props: IResetPasswordTokenProps) {
    this.id = props.id ?? 'generateId?';
    this.user = props.user;
    this.token = props.token;
    this.expirationDate = props.expirationDate;
  }

  get isExpired(): boolean {
    return this.expirationDate < new Date();
  }

  public expire(): void {
    this.expirationDate.setDate(new Date().getDate() - 1);
  }

  public static create(props: IResetPasswordTokenProps) {
    return new ResetPasswordToken(props);
  }
}
