const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://taskapp:WXHCFSgHBzIU3Lst@cluster0.1ojx3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("connected");
  })
  .catch((e) => {
    console.log(e);
  });
