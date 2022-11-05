import { Email, IEmailProps } from "./Email";

export class ForgotPasswordEmail extends Email{
  private constructor(props: IEmailProps) {
    super(props)
  }
  static create(props: IEmailProps) {
    return new ForgotPasswordEmail(props)
  }
  protected generateTemplate(): unknown {
    return ''
  }
}