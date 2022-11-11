
const mysql = require("mysql2/promise");

//* MYSQL Database connection
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

module.exports.getCourses = async () => {
  let qr = `SELECT c.c_id as id, c.courseId, c.courseName, i.name as
  instructor FROM Course c INNER JOIN Instructor i ON c.teacher_id = i.teacher_id`;
  const [rows] = await pool.query(qr);
  return rows;
};

module.exports.deleteBeforePutCourses = async () => {
  //* Delete all both records from Course and Instructor before PUT new records
  let qr = `DELETE FROM Course; DELETE FROM Instructor;`;
  await pool.query(`DELETE FROM Course;`);
  await pool.query(`DELETE FROM Instructor;`);
  console.log("delete all both records from Course and Instructor");
};

module.exports.putCourses = async (cCode, cName, iName) => {
  //- Procedure for insert both course and instructor table
  let qr_procedure = `
  CREATE PROCEDURE putCoursesAndInstructor(IN cCode VARCHAR(255), IN cName VARCHAR(255), IN iName VARCHAR(255))
  BEGIN
	INSERT INTO Course(courseId, courseName)
	VALUES (cCode, cName);
	INSERT INTO Instructor(name)
	VALUES (iName);
	UPDATE Course
	SET teacher_id = (SELECT MAX(teacher_id) FROM Instructor)
	WHERE c_id = (SELECT MAX(c_id) from Course);
  END;`;

  //- Trigger for update course's teacher_id foreign key
  let qr_afterUpdateInstructor = `
  CREATE TRIGGER after_instructor_update
  AFTER INSERT
  ON Instructor FOR EACH ROW
  BEGIN
  UPDATE Course
  SET teacher_id = (SELECT max(teacher_id) FROM Instructor)
  ORDER BY c_id DESC LIMIT 1;
  END;`;

  const result = await pool.query(`CALL putCoursesAndInstructor(?, ?, ?)`, [
    cCode,
    cName,
    iName,
  ]);
  if (result) {
    console.log("Successfully, update both table for Course and Instructor");
  }
};

module.exports.deleteRecord = async (id) => {
  const [targetRecord] = await pool.query(`SELECT teacher_id FROM Course WHERE c_id = ?`, [id])
  let target_fk = {
    teacher_id: targetRecord[0].teacher_id
  }
  //- delete course
  await pool.query(`DELETE FROM Course WHERE c_id = ?`, [id]);
  //* delete instructor
  const res = await pool.query(`DELETE FROM Instructor WHERE teacher_id = ?`, [
    target_fk.teacher_id,
  ]);
  if (res) {
    console.log(
      `Delete both records from Course and Instructor at c_id and teach_id ${target_fk.teacher_id}`
    );
  }
};

module.exports.addCourseAndInstructor = async (cCode, cName, iName) => {
  //- Procedure for insert both course and instructor table
  let qr_procedure = `
    CREATE PROCEDURE putCoursesAndInstructor(IN cCode VARCHAR(255), IN cName VARCHAR(255), IN iName VARCHAR(255))
    BEGIN
    INSERT INTO Course(courseId, courseName)
    VALUES (cCode, cName);
    INSERT INTO Instructor(name)
    VALUES (iName);
    END;`;

  //- Trigger for update course's teacher_id foreign key
  let qr_afterUpdateInstructor = `
    CREATE TRIGGER after_instructor_update
    AFTER INSERT
    ON Instructor FOR EACH ROW
    BEGIN
    UPDATE Course
    SET teacher_id = (SELECT max(teacher_id) FROM Instructor)
    WHERE c_id = (SELECT MAX(teacher_id) from Instructor);
    END;`;

  const res = await pool.query(`CALL putCoursesAndInstructor(?, ?, ?)`, [
    cCode,
    cName,
    iName,
  ]);
  if (res) {
    console.log(
      "Successfully, insert new records both table for Course and Instructor",
      res
    );
  }
};
