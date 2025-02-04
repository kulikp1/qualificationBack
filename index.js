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

app.use((req, res, next) => {
    res.status(404).send({ status: 404, message: "Route not found" });
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});