export interface IEmailProps {
  from: string;
  to: string;
  title: string;
  params: { [key: string]: string };
}

export abstract class Email {
  from: string;
  to: string;
  title: string;
  properties: { [key: string]: string };
  template: unknown;
  protected constructor(props: IEmailProps) {
    this.from = props.from;
    this.to = props.to;
    this.title = props.title;
    this.properties = props.params;

    this.template = this.generateTemplate();
  }

  protected abstract generateTemplate(): unknown;
}
