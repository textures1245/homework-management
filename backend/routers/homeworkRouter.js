const express = require("express");
const hController = require("../controllers/homeworkController");
const app = express();

module.exports.fetchHomework = async (req, res, next) => {
  const mode = req.params.mode;
  const filterCourseGroupId = req.body;
  const homeworks = await hController.getHomeworks(
    mode,
    filterCourseGroupId.c_id
  );
  res.send({
    message: "Fetch all homeworks data",
    data: homeworks,
  });
};

module.exports.postHomework = async (req, res, next) => {
  const hBody = req.body;
  const h = {
    title: hBody.title,
    description: hBody.description,
    status: 0,
  };
  const hDate = {
    createdDate: hBody.createdDate,
    deadlineDate: hBody.deadlineDate,
  };
  const imgStore = {
    imageURLs: hBody.imageUrls.length > 0 ? hBody.imageUrls : null,
  };
  const tm = { ...hBody.groupWork.teammates };
  const g_id = hBody.groupWork.g_id;
  const cId = hBody.course.id;
  if (hBody) {
    if (tm.name == null) {
      await hController.addHomework(h, hDate, imgStore.imageURLs, cId);
    } else {
      await hController.addGroupHomework(
        h,
        hDate,
        imgStore.imageURLs,
        cId,
        tm.prefixName,
        tm.name,
        tm.assigned,
        tm.done_status,
        tm.tm_code
      );
    }
  }
  res.status(201).json({
    message: "Post Homework Action Successfully.",
  });
};

module.exports.updatedHomework = async (req, res, next) => {
  const hBody = req.body;
  const h = {
    h_id: hBody.h_id,
    title: hBody.title,
    description: hBody.description,
    status: 0,
  };
  const hDate = {
    createdDate: hBody.createdDate,
    deadlineDate: hBody.deadlineDate,
  };
  const imgStore = {
    imageURLs: hBody.imageUrls.length > 0 ? hBody.imageUrls : null,
  };
  const cId = hBody.course.id;
  console.log(hBody, imgStore);
  if (hBody) {
    await hController.updateHomework(h, hDate, imgStore.imageURLs, cId);
  }
  res.status(200).json({
    message: `Patch Homework Action Successfully on h_id ${hBody.h_id}`,
    data: hBody,
  });
};

module.exports.deleteHomework = async (req, res, next) => {
  const h_id = +req.params.id;
  if (h_id != -1 && h_id) {
    await hController.deleteHomework(h_id);
  }
  res.status(200).json({
    message: `Delete Homework Action Successfully on h_id ${h_id}`,
  });
};

module.exports.changedHomeworkStatus = async (req, res, next) => {
  const changedStatusId = req.body.payload;
  await hController.changedStatus(changedStatusId);
  res.status(200).json({
    message: `Changed homework finished status successfully on h_id ${changedStatusId} to 1`,
  });
};
