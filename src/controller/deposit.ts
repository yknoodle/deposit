import express from 'express'
import {deposit, getPlan, listPortfolio, mergeAllocations} from "../deposit";
import {mergeArrayToMap} from "../utilities";

export const depositRouter = express.Router()

depositRouter.get('/test', (req, res) => {
    res.send('server is up')
})

depositRouter.post('/peek',(req,res) => {
    const {
        monthly: monthlyArray, onetime: onetimeArray, deposits
    } = req.body
    console.log('received', monthlyArray, onetimeArray, deposits)
    const onetime = mergeArrayToMap(onetimeArray, o=>o.name, o=>o.allocation, mergeAllocations)
    const monthly = mergeArrayToMap(monthlyArray, o=>o.name, o=>o.allocation, mergeAllocations)
    res.send(Object.entries(deposit(monthly, onetime,deposits)).map(listPortfolio))
})
depositRouter.post('/peek/v0',(req,res) => {
    const {
        plans, deposits
    } = req.body
    console.log('received', plans, deposits)
    const onetime = getPlan(plans)
    const monthly = getPlan(plans, true)
    res.send(Object.entries(deposit(monthly, onetime, deposits)).map(listPortfolio))
})
