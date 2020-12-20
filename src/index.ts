import express from 'express'
import {depositRouter} from "./controller/deposit"

let app = express();
const port = 3000;
app.use(
    express.json())
app.use('/deposit', depositRouter)
app.listen(port, err => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server is listening on ${port}`)
})
