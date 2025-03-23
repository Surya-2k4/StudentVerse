import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
 // ✅ Importing CSS for styling

const StudentDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchStudents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/students', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudents(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch students:', err);
        setError('Failed to load students. Please try again.');
        setLoading(false);
      }
    };

    fetchStudents();
  }, [navigate]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="student-dashboard">
      <h1>📚 Student Dashboard</h1>

      {students.length === 0 ? (
        <p className="no-data">No student records found.</p>
      ) : (
        <table className="student-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Course</th>
              <th>Batch</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.age}</td>
                <td>{student.course}</td>
                <td>{student.batch}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentDashboard;
