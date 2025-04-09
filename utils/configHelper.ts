import * as fs from 'fs';
import * as path from 'path';

const CONFIG_FILE_PATH = path.resolve(__dirname, 'credentials.json');

interface Credentials {
  inboxId: string;
  username: string;
  password: string;
}

export class ConfigHelper {
  static saveCredentials(credentials: Credentials): void {
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(credentials, null, 2), 'utf-8');
  }

  static getCredentials(): Credentials {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const rawData = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8');
      return JSON.parse(rawData);
    } else {
      throw new Error('Credentials file not found');
    }
  }
}