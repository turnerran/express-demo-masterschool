const express = require("express");
const Joi = require("joi");

const app = express();

const users = [
  {
    id: 1,
    name: "John",
  },
  {
    id: 3,
    name: "Robert",
  },
  {
    id: 5,
    name: "Bob",
  },
  {
    id: 7,
    name: "Nick",
  },
];

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
  {
    name: "German",
    id: 5,
  },
];

// 5) Last question
// You have a helper module which contains the `generateRandomId` function. it returns an number between 1 - 10
// You should create a middleware which calls that function on each request
// in case that users array above doesn't contain this is, the function should return a 403 (not authorized) to the client
// else, call next and proceed the request

// /api/courses?name=cou
app.get("/api/courses", (req, res) => {
  const name = req.query.name || "";

  res.send(courses.filter((x) => x.name.startsWith(name)));
});

app.post("/api/courses", (req, res) => {
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

// 1) implement a get method to retrieve a course by it's id
//api/courses/5

app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find((course) => course.id === Number(req.params.id));
  if (!course) {
    return res.status(404).send("No such course exists");
  }

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
});

// 3) implement a put method to update a course name by it's id

const port = process.env.PORT || 3000;
app.listen(3000, () => console.log(`listening on port ${port} !!.....`));

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(course, schema);
}
