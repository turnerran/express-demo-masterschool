const express = require("express");
const Joi = require("joi");

//const coursesRoute = require("./routes/courses");

const app = express();

// built in middlewares

app.use(express.json()); // in case there is a body in the request it will populate req.body
app.use(express.static("public")); // allows to serve static content (try localhost:3000/readme.txt)

// custom middleware
app.use(function (req, res, next) {
  console.log("authenticating...");
  //return res.status(401).send("not authenticated");
  next();
});

//app.use("/api/courses", coursesRoute); // any route that start with /api/courses , let courses router handle

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

app.get("/", (req, res) => {
  res.send("hello world!!!");
});

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

//api/courses/5
app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((course) => course.id === Number(req.params.id));
  if (!course) {
    res.status(404).send("No such course exists");
  }

  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find((course) => course.id === Number(req.params.id));
  if (!course) {
    return res.status(404).send("No such course exists");
  }

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
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

const port = process.env.PORT || 3000;
app.listen(3000, () => console.log(`listening on port ${port} !!.....`));

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(course, schema);
}
