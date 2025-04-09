import * as fs from "fs";
import * as path from "path";

// export class TestDataManager {
//     static getTestData(fileName: string): any {
//         const filePath = path.join(__dirname, `../testData/${fileName}`);
//         const data = fs.readFileSync(filePath, "utf-8");
//         return JSON.parse(data);
//     }

//     static saveTestData(fileName: string, data: object) {
//         const filePath = path.join(__dirname, `../testData/${fileName}`);
//         fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
//     }
// }

export class TestDataManager {
    private static testDataPath = path.resolve(__dirname, '../testData/');

  /**
   * Saves test data into a JSON file.
   * @param fileName - Name of the JSON file
   * @param data - Data to save
   */
  static saveTestData(fileName: string, data: Record<string, any>): void {
    const filePath = path.join(this.testDataPath, fileName);
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      console.log(`Data saved successfully: ${fileName}`);
    } catch (error) {
      console.error(`Error saving test data:`, error);
    }
  }

  /**
   * Retrieves test data from a JSON file.
   * @param fileName - Name of the JSON file
   * @returns Parsed JSON object or null if an error occurs
   */
  static getTestData<T = any>(fileName: string): T | null {
    const filePath = path.join(this.testDataPath, fileName);
    try {
      if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);

      const rawData = fs.readFileSync(filePath, 'utf-8');
      if (!rawData) throw new Error(`File is empty: ${filePath}`);

      return JSON.parse(rawData) as T;
    } catch (error) {
      console.error(`Error reading test data:`, error);
      return null;
    }
  }
}
