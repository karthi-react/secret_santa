import React, { useState } from "react";
import * as XLSX from "xlsx";

interface Employee {
  Employee_Name: string;
  Employee_EmailID: string;
  Secret_Child_Name?: string;
  Secret_Child_EmailID?: string;
}

const FileUpload = ({ setAssignment }:any) => {
  const [assignments, setAssignments] = useState<Employee[]>([]);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [previousFile, setPreviousFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: "current" | "previous") => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".xlsx")) {
      alert("Please upload a valid Excel (.xlsx) file!");
      return;
    }

    if (type === "current") {
      setCurrentFile(file);
    } else {
      setPreviousFile(file);
    }
  };

  const handleProcessXLSX = async () => {
    if (!currentFile || !previousFile) {
      alert("Please upload both Excel files!");
      return;
    }

    // Convert both files to JSON
    const currentEmployees = await readXLSX(currentFile);
    const previousAssignments = await readXLSX(previousFile);

    const finalAssignments = assignSecretSanta(currentEmployees, previousAssignments);
    setAssignments(finalAssignments);
    setAssignment(finalAssignments);
  };

  const readXLSX = async (file: File): Promise<Employee[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = ({ target }) => {
        if (!target?.result) return reject("Failed to read file");

        const workbook = XLSX.read(target.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const jsonData: Employee[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        resolve(jsonData);
      };

      reader.onerror = () => reject("Error reading file");
      reader.readAsBinaryString(file);
    });
  };

  const assignSecretSanta = (employees: Employee[], prevAssignments: Employee[]) => {
    const previousPairs = new Map(prevAssignments.map(emp => [emp.Employee_EmailID, emp.Secret_Child_EmailID]));
console.log(new Map(prevAssignments.map(emp => [emp.Employee_EmailID, emp.Secret_Child_EmailID])))
    let shuffled = [...employees];
    let maxRetries = 100;

    do {
      shuffled.sort(() => 0.5 - Math.random());
      maxRetries--;
    } while (
      maxRetries > 0 &&
      shuffled.some((emp, index) => emp.Employee_EmailID === shuffled[index].Employee_EmailID || previousPairs.get(emp.Employee_EmailID) === shuffled[index].Employee_EmailID)
    );

    const finalAssignments = employees.map((employee, index) => ({
      Employee_Name: employee.Employee_Name,
      Employee_EmailID: employee.Employee_EmailID,
      Secret_Child_Name: shuffled[index].Employee_Name,
      Secret_Child_EmailID: shuffled[index].Employee_EmailID,
    }));

    return finalAssignments;
  };

  const handleDownloadExcel = () => {
    if (assignments.length === 0) {
      alert("No data to download!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(assignments);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SecretSantaAssignments");

    XLSX.writeFile(workbook, "Secret_Santa_Assignments.xlsx");
  };

  return (
    <div>
      <div>
        <label>Upload Current Year Employees (XLSX):</label>
        <input type="file" accept=".xlsx" onChange={(e) => handleFileUpload(e, "current")} />
      </div>
      <div>
        <label>Upload Previous Year Assignments (XLSX):</label>
        <input type="file" accept=".xlsx" onChange={(e) => handleFileUpload(e, "previous")} />
      </div>
      <button onClick={handleProcessXLSX}>Process</button>
      {assignments.length > 0 && <button onClick={handleDownloadExcel}>Download Excel</button>}
    </div>
  );
};

export default FileUpload;
