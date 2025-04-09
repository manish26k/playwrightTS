import * as XLSX from "xlsx";
import * as fs from "fs";

export class TestDataReader {
  static excelFilePath = "./testData/LoginCredentials.xlsx";
  static jsonFilePath = "./testData/LoginCredentials.json";
  static sheetName = "Login";  // 🔹 Static Sheet Name

  // Read data dynamically from Excel or JSON
  static readTestData(source: "excel" | "json"): any[] {
    if (source === "excel" && fs.existsSync(this.excelFilePath)) {
      return this.readExcelData();
    } else if (source === "json" && fs.existsSync(this.jsonFilePath)) {
      return this.readJsonData();
    } else {
      throw new Error(`❌ Test data file not found: ${source === "excel" ? this.excelFilePath : this.jsonFilePath}`);
    }
  }

  private static readExcelData(): any[] {
    const workbook = XLSX.readFile(this.excelFilePath);
    const sheet = workbook.Sheets[this.sheetName];
    if (!sheet) throw new Error(`❌ Sheet '${this.sheetName}' not found in Excel file.`);
    return XLSX.utils.sheet_to_json(sheet);
  }

  private static readJsonData(): any[] {
    return JSON.parse(fs.readFileSync(this.jsonFilePath, "utf-8"));
  }
}
