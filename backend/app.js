
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
const path = require("path");
const fs = require("fs");

//* controllers
const hController = require("./controllers/homeworkController");
const courseController = require("./controllers/courseController");
const { catchAsync } = require("./errors/catchAsync");
const homeworkRouter = require("./routers/homeworkRouter");
const courseRouter = require("./routers/courseRouter");

//* Enable All CORS requests
app.use(cors());

//- Image uploader config
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, "backend/images");
  },
  filename: (req, file, cd) => {
    console.log(file);
    cd(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

app.post("/upload", upload.single("image"), (req, res) => {
  let oldPath = req.file.path;
  let newPath = `src/assets/images/${req.file.filename}`;
  fs.rename(oldPath, newPath, (err) => {
    if (err) throw err;
    console.log(err);
  });
  res.send({
    message: "Image uploaded",
    imagePath: newPath,
  });
});

// app.get("/upload", (req, res, next) => {
//   const
// });

//* Enable parsing json body.
app.use(bodyParser.json());

//* MYSQL Database connection
//- production mode
// const pool = mysql.createPool('mysql://nv0qerzanlgdeyh80wjp:main-2022-oct-30-p02leq@ap-southeast.connect.psdb.cloud/homework-management?ssl={"rejectUnauthorized":true}')
// const pool = mysql.createPool({
//   host: 'ap-southeast.connect.psdb.cloud',
//   user: 'nv0qerzanlgdeyh80wjp',
//   password: 'main-2022-oct-30-p02leq',
//   database: 'homework-management',
//   ssl: {
//     rejectUnauthorized: true
//   }
// });
//- test mode
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "rty1245",
  database: "homeworkDB",
  port: 3306,
});

// //* Check if DB was connected
pool.getConnection((err, conn) => {
  if (err) {
    console.log("Cannot to the database", err);
  } else {
    console.log("Database connecting");
  }
  pool.releaseConnection(conn);
});

//- homework

//* fetch api with sort filter
app.put("/api/homeworks/:mode", catchAsync(homeworkRouter.fetchHomework));

//* add homework
app.post("/api/homeworks", catchAsync(homeworkRouter.postHomework));

//* delete homework with primary key
app.delete(
  "/api/homeworks/:id/:delFilter",
  catchAsync(homeworkRouter.deleteHomework)
);

//* update homework and fk table
app.patch("/api/homeworks", catchAsync(homeworkRouter.updatedHomework));

//* changed homework's status
app.put("/api/homeworks", catchAsync(homeworkRouter.changedHomeworkStatus));

//- courses
//* Fetch Data
app.get("/api/courses", async (req, res, next) => {
  const courses = await courseController.getCourses();
  res.send({
    message: "Fetch all courses data",
    courses: courses,
  });
});

//* Add Course
app.post("/api/courses", catchAsync(courseRouter.addCourse));

//* Put Course (Don't used)
app.put("/api/courses", async (req, res, next) => {
  let coursesRes = req.body;
  let courses = coursesRes.map((res) => {
    return {
      courseId: res.courseId,
      courseName: res.courseName,
    };
  });
  let instructor = coursesRes.map((res) => {
    return {
      name: res.instructor,
    };
  });
  console.log(courses, instructor);
  await courseController.deleteBeforePutCourses();
  if (coursesRes.length > 0) {
    for (let i = 0; i < coursesRes.length; i++) {
      await courseController.putCourses(
        courses[i].courseId,
        courses[i].courseName,
        instructor[i].name
      );
    }
  }
  res.status(201).json({
    message: "PUT action successfully.",
    courses: coursesRes,
  });
});

//* delete course
app.delete("/api/courses/:id", catchAsync(courseRouter.deleteCourse));

//* Error handling
app.use((err, req, res, next) => {
  if (err) {
    console.error(err.stack);
    res.status(500).send({
      error: "something went wrong",
    });
  }
});

module.exports = app;
