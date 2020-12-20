import express from 'express'
import {depositRouter} from "./controller/deposit"
import swagger from 'swagger-ui-express'
import swaggerDocument from './openapi.json'
let app = express();
const port = 3000;
app.use(
    express.json())
app.use('/deposit', depositRouter)
app.use('/', swagger.serve, swagger.setup(swaggerDocument))
app.listen(port, err => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server is listening on ${port}`)
})
