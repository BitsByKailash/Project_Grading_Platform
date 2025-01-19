document.addEventListener("DOMContentLoaded", () => {
    const studentForm = document.getElementById("studentForm");
    const studentList = document.getElementById("studentList");
  
    // Fetch and display all students
    async function fetchStudents() {
      const response = await fetch("/api/students");
      const students = await response.json();
      studentList.innerHTML = "";
      students.forEach((student) => {
        const li = document.createElement("li");
        li.textContent = ${student.name} - Grade: ${student.grade};
        studentList.appendChild(li);
      });
    }
  
    // Add new student
    studentForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const grade = document.getElementById("grade").value;
  
      await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, grade }),
      });
  
      studentForm.reset();
      fetchStudents();
    });
  
    // Initial fetch
    fetchStudents();
  });
  