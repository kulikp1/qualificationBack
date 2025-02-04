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

//Handle 404
app.use((req, res, next) => {
    res.status(404).send({ status: 404, message: "Route not found" });
});

//Handle Server error
app.use((error, req, res, next) => {
    console.error(error);

    res.status(500).send({ status: 500, message: "Internal Server Error" })
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});