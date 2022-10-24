const courseController = require("../controllers/courseController");

module.exports.addCourse = async (req, res, next) => {
  let cBody = req.body;
  let c = cBody.map((res) => {
    return {
      courseId: res.courseId,
      courseName: res.courseName,
    };
  });
  let instructor = cBody.map((res) => {
    return {
      name: res.instructor,
    };
  });
  if (cBody.length > 0) {
    for (let i = 0; i < cBody.length; i++) {
      await courseController.addCourseAndInstructor(
        c[i].courseId,
        c[i].courseName,
        instructor[i].name
      );
    }
  }
  res.status(201).json({
    message: "Post Courses Action successfully",
    courseJson: cBody,
  });
};

module.exports.deleteCourse = async (req,res,next) => {
  await courseController.deleteRecord(req.params.id);
  res.status(201).json({
    message: "Delete action successfully",
  });
}

