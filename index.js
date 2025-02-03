import express from "express";

const app = express();

app.get("/", (res, req) => {
    req.send("Hello World");
})

app.listen(8080, () => {
    console.log("server 8080");
});