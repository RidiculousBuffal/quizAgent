// src/utils/exportUtils.ts
import * as XLSX from 'xlsx';

export interface WorksheetData {
    name: string;
    data: Record<string, any>[];
}

export const exportToExcel = (worksheets: WorksheetData[], filename: string): void => {
    // 创建工作簿
    const workbook = XLSX.utils.book_new();

    // 添加每个工作表
    worksheets.forEach((sheet) => {
        const worksheet = XLSX.utils.json_to_sheet(sheet.data);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
    });

    // 导出Excel文件
    XLSX.writeFile(workbook, `${filename.substring(0,10)}.xlsx`);
};