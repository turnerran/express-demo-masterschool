const express = require("express");
const router = express.Router();

const courses = [
  {
    name: "Math",
    id: 1,
  },
  {
    name: "English",
    id: 2,
  },
  {
    name: "History",
    id: 3,
  },
  {
    name: "History 2",
    id: 4,
  },
];

router.get("/", (req, res) => {
  const name = req.query.name;

  res.send(courses.filter((x) => x.name.startsWith(name || "")));
});

router.delete("/:id", (req, res) => {
  const course = courses.find((course) => course.id === Number(req.params.id));
  if (!course) {
    return res.status(404).send("No such course exists");
  }

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
});

router.put("/:id", (req, res) => {
  const course = courses.find((course) => course.id === Number(req.params.id));
  if (!course) {
    return res.status(404).send("No such course exists");
  }

  const { error } = validateCourse(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  course.name = req.body.name;
  res.send(course);
});

router.post("/", (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const course = {
    name: req.body.name,
    id: courses.length + 1,
  };
  courses.push(course);

  res.send(course);
});

router.get("/:id", (req, res) => {
  const course = courses.find((course) => course.id === Number(req.params.id));
  if (!course) {
    return res.status(404).send("No such course exists");
  }

  res.send(course);
});

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(course, schema);
}

module.exports = router;

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(course, schema);
}
