import React, { useEffect, useState } from "react";
import FileUpload from "./components/FileUpload";
import AssignmentsTable from "./components/AssignmentsTable";

const App = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
useEffect(()=>{
console.log(JSON.stringify(assignments)+"kljhgfsdfghj");
},[assignments]);
  return (
    <div>
      <h1>Secret Santa Game</h1>
      <FileUpload setAssignment={setAssignments} />
      {assignments.length > 0 && <AssignmentsTable assignments={assignments} />}
    </div>
  );
};

export default App;
