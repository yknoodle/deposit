import express from 'express'
import {getPlan, depositService0, depositService} from "../deposit";

export const depositRouter = express.Router()

depositRouter.get('/test', (req, res) => {
    res.send('server is up')
})

depositRouter.post('/peek',(req,res) => {
    const {
        monthly: monthlyArray, onetime: onetimeArray, deposits
    } = req.body
    console.log('received', req.body)
    depositService(monthlyArray, onetimeArray, deposits)
    .then(result => {
        if (result.validationErrors.length>0)
            res.status(400).send({problems: result.validationErrors})
        else res.status(200).send({portfolios: result.values})
    }).catch(err => res.status(500).send(err))
})
depositRouter.post('/peek/v0',(req,res) => {
    const {
        plans, deposits
    } = req.body
    console.log('received', req.body)
    const onetime = getPlan(plans)
    const monthly = getPlan(plans, true)
    depositService0(monthly, onetime, deposits)
        .then(result => {
            if (result.validationErrors.length>0)
                res.status(400).send({problems: result.validationErrors})
            else res.status(200).send({portfolios: result.values})
        }).catch(err => res.status(500).send(err))
})
