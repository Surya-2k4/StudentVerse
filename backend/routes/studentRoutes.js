const express = require('express');
const Student = require('../models/Student');
const router = express.Router();


// ✅ Create Student (Admin only)
router.post('/', async (req, res) => {
    const { name, email, age, course, batch } = req.body;
  
    if (!name || !email || !age || !course || !batch) {
      return res.status(400).send('All fields (name, email, age, course, batch) are required.');
    }
  
    try {
      const student = new Student({ name, email, age, course, batch });
      await student.save();
      res.status(201).send('Student created successfully!');
    } catch (error) {
      res.status(500).send(`Error creating student: ${error.message}`);
    }
  });

// ✅ Get All Students (User & Admin)
router.get('/', async (req, res) => {
    try {
      const students = await Student.find(); // Fetch all students
      res.status(200).json(students); // Send the full student data, including batch
    } catch (error) {
      res.status(500).send(`Error fetching students: ${error.message}`);
    }
  });

// ✅ Update Student (Admin only)
router.put('/:id', async (req, res) => {
    try {
        const { name, email, age, course } = req.body;

        // Validate request body
        if (!name || !email || !age || !course) {
            return res.status(400).send('All fields (name, email, age, course) are required.');
        }

        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            { name, email, age, course },
            { new: true, runValidators: true } // Return the updated document and validate
        );

        if (!updatedStudent) {
            return res.status(404).send('Student not found.');
        }

        res.send('Student updated successfully!');
    } catch (error) {
        res.status(500).send(`Error updating student: ${error.message}`);
    }
});

// ✅ Delete Student (Admin only)
router.delete('/:id', async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);

        if (!deletedStudent) {
            return res.status(404).send('Student not found.');
        }

        res.send('Student deleted successfully!');
    } catch (error) {
        res.status(500).send(`Error deleting student: ${error.message}`);
    }
});

module.exports = router;