import { injectable } from 'inversify';
import { Email } from '../../domain/Email';

@injectable()
export class EmailService {
  send(email: Email): void {
    console.log({ params: email.properties });
  }
}
