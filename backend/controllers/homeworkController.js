const mysql = require("mysql2/promise");

//* MYSQL Database connection
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "rty1245",
  database: "homeworkDB",
  port: 3306,
});

module.exports.getHomeworks = async (modeReq, cFilterId) => {
  let modeSort = "";
  var findCourseId = "";

  //- Sort Filter
  switch (modeReq) {
    case "LEAST_REMAINING":
      modeReq = `NOW() - hd.deadlineDate DESC`;
      break;
    case "NEWEST_CREATED":
      modeReq = "hd.createdDate DESC";
      break;
    case "MOST_REMAINING":
      modeReq = `NOW() - hd.deadlineDate`;
      break;
    case "OLDEST_CREATED":
      modeReq = `hd.createdDate`;
      break;
    default:
      console.error("fetch mode is not correct!");
      return;
  }

  //- Course Flitter
  if (cFilterId != -1) {
    findCourseId = `WHERE c.c_id = ${cFilterId}`;
  }

  let qr = `SELECT h.h_id, h.title, h.description, hd.createdDate, hd.deadlineDate, hd.finishedDate,
    h.status,img_s.imageURL, c.c_id, c.courseId, c.courseName, i.name as i_name, gw.g_id, t.tm_id,
    t.tm_code, t.prefix_name, t.name as tm_name, t.assigned, t.done_status
    FROM Homework as h LEFT JOIN GroupWork as gw
    ON h.g_id = gw.g_id LEFT JOIN Teammate as t
    ON gw.g_id = t.g_id LEFT JOIN HomeworkDate as hd
    ON h.date_id = hd.date_id LEFT JOIN Image_store img_s
    ON h.img_store_id = img_s.img_store_id  LEFT JOIN Course as c
    ON h.c_id = c.c_id INNER JOIN Instructor i
    ON c.teacher_id = i.teacher_id
     ${findCourseId} ORDER BY ${modeReq};`;
  const [rows] = await pool.query(qr);
  return rows;
};

module.exports.addHomework = async (h, hDate, imgURLs, cId) => {
  let qr_procedure = `
  CREATE PROCEDURE insertHomeworkRecords(IN t_Input VARCHAR(255),IN desc_input VARCHAR(2500),IN status_input TINYINT,
  IN create_date DATE, IN deadline_date DATE, IN imageURLs JSON)
	BEGIN
		INSERT INTO Image_store(imageURL)
		VALUES (imageURLs);
		INSERT INTO Homework(title, description, status)
		VALUES (t_input, desc_input, status_input);
    INSERT INTO HomeworkDate(createdDate, deadlineDate)
		VALUES (create_date, deadline_date);
	END;`;

  let qr_trigger = `
  CREATE TRIGGER updateForeignKeyAfterHomework
  AFTER INSERT ON HomeworkDate FOR EACH ROW
	  BEGIN
		  UPDATE Homework
  		SET date_id = (SELECT max(date_id) FROM HomeworkDate),
  		img_store_id = (SELECT max(img_store_id) FROM Image_store)
  		ORDER BY c_id DESC
  		LIMIT 1;
	  END;
  `;

  await pool.execute(`CALL insertHomeworkRecords(?, ?, ?, ?, ?, ?)`, [
    h.title,
    h.description,
    h.status,
    hDate.createdDate,
    hDate.deadlineDate,
    imgURLs,
  ]);
  const res = await pool.query(
    `
  UPDATE Homework
  SET c_id = ?
  ORDER BY h_id DESC
  LIMIT 1;
  `,
    [cId]
  );
  if (res) {
    console.log("Add Homework record successfully.");
  }
};

module.exports.addGroupHomework = async (
  h,
  hDate,
  imageURLs,
  cId,
  prefixName,
  name,
  assigned,
  done_status,
  tm_code
) => {
  let qr_procedure = `
    CREATE PROCEDURE insertGroupHomeworkRecords(
    IN t_Input VARCHAR(255),IN desc_input VARCHAR(2500),IN status_input TINYINT,
    IN create_date DATE, IN deadline_date DATE, IN imageURLs JSON, IN tmPrefix JSON,
    IN tmName JSON, IN tmAssigned JSON, IN tmDoneStatus JSON, IN tmCode JSON)
    BEGIN
    INSERT INTO Image_store(imageURL)
    VALUES (imageURLs);
    INSERT INTO Homework(title, description, status)
    VALUES (t_input, desc_input, status_input);
    INSERT INTO HomeworkDate(createdDate, deadlineDate)
    VALUES (create_date, deadline_date);
    INSERT INTO Teammate(tm_code, prefix_name, name, assigned, done_status)
    VALUES (tmCode, tmPrefix, tmName, tmAssigned, tmDoneStatus);
    INSERT INTO GroupWork()
    VALUES ();
    END;`;

  let qr_trigger = `
  CREATE TRIGGER updateGroupWorkId_FK
  AFTER INSERT ON GroupWork FOR EACH ROW
  BEGIN
	UPDATE Teammate
	SET g_id = (SELECT max(g_id) FROM GroupWork)
	ORDER BY tm_id DESC LIMIT 1;
	UPDATE Homework
  SET date_id = (SELECT max(date_id) FROM HomeworkDate),
  img_store_id = (SELECT max(img_store_id) FROM Image_store),
  g_id = (SELECT MAX(g_id) FROM GroupWork)
  ORDER BY h_id DESC
  LIMIT 1;
  END;`;


  await pool.execute(
    `CALL insertGroupHomeworkRecords(?, ?, ?, ? ,?, ?, ?, ?, ?, ?, ?)`,
    [
      h.title,
      h.description,
      h.status,
      hDate.createdDate,
      hDate.deadlineDate,
      imageURLs,
      prefixName,
      name,
      assigned,
      done_status,
      tm_code,
    ]
  );

  //- Updated FK Course
  const res = await pool.query(
    `
  UPDATE Homework
  SET c_id = ?
  ORDER BY h_id DESC
  LIMIT 1;
  `,
    [cId]
  );

  if (res) {
    console.log("Add Group Homework record successfully.");
  }
};

module.exports.deleteHomework = async (h_id) => {
  const qr_procedure = `
  CREATE PROCEDURE removeHomeworkAndFKrecord(IN hId INT, IN dateId INT,IN imgId INT)
  BEGIN
	DELETE FROM Homework
	WHERE h_id = hId;
	DELETE FROM HomeworkDate
	WHERE date_id = dateId;
	DELETE FROM Image_store
	WHERE img_store_id = imgId;
  END;`;

  const [targetDelete] = await pool.query(
    `SELECT date_id, img_store_id FROM Homework WHERE h_id = ?`,
    [h_id]
  );
  const fks_target = {
    date_id: targetDelete[0].date_id,
    img_store_id: targetDelete[0].img_store_id,
  };
  //* Enable cascade delete action on homework's foreign keys to enable deleting child record (hDate, imgStore)
  const res = await pool.query(`CALL removeHomeworkAndFKrecord(?, ?, ?)`, [
    h_id,
    fks_target.date_id,
    fks_target.img_store_id,
  ]);

  if (res) {
    console.log(
      `Delete homework record at h_id: ${h_id} and FK on date_id: ${fks_target.date_id}, img_store_id: ${fks_target.img_store_id}`
    );
  }
};

module.exports.updateHomework = async (h, hDate, imgStore, cId) => {
  const [updateItem] = await pool.query(
    `SELECT * FROM Homework WHERE h_id = ?`,
    [h.h_id]
  );
  const fks = {
    date_id: updateItem[0].date_id,
    img_store_id: updateItem[0].img_store_id,
    c_id: updateItem[0].c_id,
  };
  if (!fks) {
    console.err("Record that gonna updated cant be found on key" + h.h_id);
    return;
  }
  const updateH_procedure = `
  CREATE PROCEDURE updateHomeworkRecord(IN hId INT, IN cId INT, IN t_Input VARCHAR(255),IN desc_input VARCHAR(2500),IN status_input TINYINT, )
  BEGIN
	UPDATE Homework
	SET title = t_input, description = desc_input, status = status_input, c_id = cId
	WHERE h_id = hId;
  END;`;
  const updateFKH_procedure = `
  CREATE PROCEDURE updateFKHomeworkRecord(IN dateId INT, IN imgId INT, IN deadline_date DATE, IN imageURLs JSON)
  BEGIN
	UPDATE HomeworkDate
	SET deadlineDate = deadline_date
	WHERE date_id = dateId;
	UPDATE Image_store
	SET imageURL = imageURLs
	WHERE img_store_id = imgId;
  END;`;

  await pool.query(`CALL updateHomeworkRecord(?, ?, ?, ?, ?)`, [
    h.h_id,
    cId,
    h.title,
    h.description,
    h.status,
  ]);
  const res = await pool.execute(`CALL updateFKHomeworkRecord(?, ?, ?, ?)`, [
    fks.date_id,
    fks.img_store_id,
    new Date(hDate.deadlineDate),
    imgStore,
  ]);
  if (res) {
    console.log(
      `Update success on h_id: ${h.h_id}, date_id: ${fks.date_id}, img_store_id: ${fks.img_store_id} and c_id: ${fks.c_id}`
    );
  }
};

module.exports.changedStatus = async (changedOnId) => {
  const [targetRecord] = await pool.query(
    `SELECT date_id FROM Homework WHERE h_id = ?`,
    [changedOnId]
  );
  const date_id = targetRecord[0].date_id;
  await pool.query(`UPDATE Homework SET status = 1 WHERE h_id = ?`, [
    changedOnId,
  ]);
  const res = await pool.query(
    `UPDATE HomeworkDate SET finishedDate = NOW() WHERE date_id = ?`,
    [date_id]
  );
  if (res) {
    console.log(
      `Update status on homework h_id ${changedOnId} to 1 and stamp date time on date_id ${date_id}`
    );
  }
};
