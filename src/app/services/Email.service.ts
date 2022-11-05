import { Email } from "../../domain/Email";

export class EmailService {
  send(email: Email): void {
    console.log({params: email.properties})
  }
}