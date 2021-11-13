const express = require("express");
require("./db/mongoose");
const Users = require("./model/user");
const Tasks = require("./model/task");
const UserRouter = require("./router/user_router");
const TaskRouter = require("./router/task_router");
const app = express();
const port = 3000;

// app.use((req,res,next)=>{
//     res.status('503').send("Site is under maintainence.Try Back soon")
// })

app.use(express.json());
app.use(UserRouter);
app.use(TaskRouter);

app.listen(port, () => {
  console.log("Server is up" + port);
});
