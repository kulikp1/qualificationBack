import express from "express";

const app = express();

function middlewareA(req, res, next) {
    console.log({ Metgod: req.method });
    console.log({ URL: req.url });
    next();
}

app.use(middlewareA) 

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.listen(8080, () => {
    console.log("server 8080");
});