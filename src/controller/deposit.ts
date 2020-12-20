import express from 'express'
import {deposit} from "../deposit";

export const depositRouter = express.Router()

depositRouter.get('/test', (req, res) => {
    res.send('server is up')
})

depositRouter.post('/',(req,res) => {
    const {
        plans, deposits
    } = req.body
    console.log('received', plans, deposits)
    res.send(deposit(plans,deposits))
})
