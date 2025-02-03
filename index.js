import express from "express";

const app = express();

app.use((req, res, next) => {
    console.log({ Metgod: req.method });
    console.log({ URL: req.url });
    next();
});

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.listen(8080, () => {
    console.log("server 8080");
});