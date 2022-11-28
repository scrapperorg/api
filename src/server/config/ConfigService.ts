import { get } from 'env-var';
import * as dotenv from 'dotenv';

dotenv.config();

export interface InternalConfig {
  JWT_SECRET: string;
  JWT_EXPIRATION_TIME: string;
  PORT: number;
  MOCK: boolean;
}

type KeyOf<TDict> = keyof TDict extends never ? string : keyof TDict;

export class ConfigService {
  private config: InternalConfig | null = null;

  public loadVars(overrides: Partial<InternalConfig> = {}): void {
    this.config = {
      JWT_SECRET: get('JWT_SECRET').required().asString(),
      JWT_EXPIRATION_TIME: get('JWT_EXPIRATION_TIME').required().asString(),
      PORT: get('PORT').default(4000).asPortNumber(),
      MOCK: get('MOCK').default('false').asBool(),
      ...overrides,
    };
  }

  public getVar<UType = InternalConfig[keyof InternalConfig]>(prop: KeyOf<InternalConfig>): UType {
    if (!this.config) {
      throw new Error(`Env config does not exists`);
    }

    return this.config[prop] as UType;
  }
}
