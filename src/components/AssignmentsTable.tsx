import React from "react";
import styles from "../styles/AssignmentsTable.module.css";

const AssignmentsTable = ({ assignments }: { assignments: any[] }) => {
    console.log(assignments)
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Employee</th>
          <th>Employee_EmailID</th>
          <th>Secret Child</th>
          <th>Secret_Child_EmailID</th>
        </tr>
      </thead>
      <tbody>
        {assignments.map((row, index) => (
          <tr key={index}>
            <td>{row.Employee_Name}</td>
            <td>{row.Employee_EmailID}</td>
            <td>{row.Secret_Child_Name}</td>
            <td>{row.Secret_Child_EmailID}</td>

          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AssignmentsTable;
