import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', age: '', course: '', batch: '' });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const validateAdmin = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'admin') {
      navigate('/');
    }
  };

  const fetchStudents = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/students', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched students:', res.data); // Debugging log
      setStudents(res.data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  useEffect(() => {
    validateAdmin();
    fetchStudents();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      console.log('Submitting form data:', formData); // Debugging log

      if (editingId) {
        console.log('Updating student with ID:', editingId);
        await axios.put(`http://localhost:5000/api/students/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditingId(null);
      } else {
        console.log('Adding new student');
        await axios.post('http://localhost:5000/api/students', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setFormData({ name: '', email: '', age: '', course: '', batch: '' });
      fetchStudents();
    } catch (error) {
      console.error('Failed to save student:', error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      console.log('Deleting student with ID:', id);
      await axios.delete(`http://localhost:5000/api/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStudents();
    } catch (error) {
      console.error('Failed to delete student:', error);
    }
  };

  return (
    <div>
      <h1>👨‍🎓 Admin Dashboard</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="course"
          placeholder="Course"
          value={formData.course}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="batch"
          placeholder="Batch"
          value={formData.batch}
          onChange={handleChange}
          required
        />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
      </form>

     <table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Age</th>
      <th>Course</th>
      <th>Batch</th> {/* Ensure Batch column is included */}
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {students.map((student) => (
      <tr key={student._id}>
        <td>{student.name}</td>
        <td>{student.email}</td>
        <td>{student.age}</td>
        <td>{student.course}</td>
        <td>{student.batch}</td> {/* Ensure Batch data is rendered */}
        <td>
          <button type="button" onClick={() => setEditingId(student._id)}>✏️ Edit</button>
          <button type="button" onClick={() => handleDelete(student._id)}>🗑️ Delete</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
};

export default AdminDashboard;
