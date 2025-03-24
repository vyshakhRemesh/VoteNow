import { createContext, useContext, useState, useEffect } from "react";

const StudentContext = createContext();

export const useStudent = () => useContext(StudentContext);

export const StudentProvider = ({ children }) => {
  const [student, setStudent] = useState(null);

  // Load student from localStorage on first render
  useEffect(() => {
    const savedStudent = localStorage.getItem("student");
    if (savedStudent) {
      setStudent(JSON.parse(savedStudent));
    }
  }, []);

  // Save to localStorage whenever student data changes
  useEffect(() => {
    if (student) {
      localStorage.setItem("student", JSON.stringify(student));
    } else {
      localStorage.removeItem("student"); // optional: clear on logout
    }
  }, [student]);

  return (
    <StudentContext.Provider value={{ student, setStudent }}>
      {children}
    </StudentContext.Provider>
  );
};
