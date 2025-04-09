import * as fs from 'fs';
import * as path from 'path';

const filePath = path.resolve(__dirname, 'PortalUserInfo.ts');

export class FileHelper {
  static writeData(data: any): void {
    const fileContent = `export const portalUserInfo = ${JSON.stringify(data, null, 2)};`;
    fs.writeFileSync(filePath, fileContent, 'utf-8');
  }

  static async readData(): Promise<any> {
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = await fs.promises.readFile(filePath, 'utf-8');
        const jsonContent = fileContent
          .replace('export const portalUserInfo =', '')
          .replace(';', '')
          .trim();
        const data = JSON.parse(jsonContent);
        return data;
      } catch (error) {
        console.error('Failed to parse JSON content:', error);
        return { currentData: {}, updatedData: {} };
      }
    }
    return { currentData: {}, updatedData: {} };
  }
}