const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Student = require("./model/students");

app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/student", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED SUCCESSFULLY");
  })
  .catch(() => console.log("Error in connecting database"));

function sendResponse(res, err, data) {
  if (err) {
    res.json({
      success: false,
      message: err,
    });
  } else if (!data) {
    res.json({
      success: false,
      message: "Not Found",
    });
  } else {
    res.json({
      success: true,
      data: data,
    });
  }
}

app.post("/student", async (req, res) => {
  try {
    const student = new Student(req.body);
    const savedStudent = await student.save();
    res.status(201).json({
      message: "Student created",
      data: savedStudent,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

// GETTING ALL THE STUDENTS
app.get("/students", async (req, res) => {
  try {
    const allStudents = await Student.find();
    console.log(allStudents);
    res.send(allStudents);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GETTING A SINGLE STUDENT BASED ON ID
app.get("/students/:id", async (req, res) => {
  try {
    const singleStudent = await Student.findById(req.params.id);
    if (!singleStudent) {
      res.status(404).json({
        success: false,
        message: "unable to find student",
      });
    } else {
      res.send(singleStudent);
    }
  } catch (e) {
    res.send(e);
  }
});

// DELETE THE USER DOCUMENT
app.delete("/students/:id", async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      res.json({
        success: false,
        message: "Unable to delete",
      });
    } else {
      res.json({
        success: true,
        message: "Student deleted",
        data: deletedStudent,
      });
    }
  } catch (e) {
    res.send(e);
  }
});

// UPDATION ROUTE
app.put("/students/:id", async (req, res) => {
  try {
    const updtStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    console.log(updtStudent);
    res.send(updtStudent);
  } catch (e) {
    res.send(e);
  }
});

app.listen(8000, () =>
  console.log("Server is running on http://localhost:8000")
);
