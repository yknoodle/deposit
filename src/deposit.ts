import {empty, flatten, format2dp, mergeArrayToMap, mergeMap, validate} from "./utilities";

export const simpleSum = (a, b) => {
    return a + b
}
export const depositService = (monthlyArray=[], onetimeArray=[], deposits) => {
    const validationErrors = [].concat(
        monthlyArray.map(portfolio => validate(portfolio, portfolioValidator)).reduce(flatten, []),
        onetimeArray.map(portfolio => validate(portfolio, portfolioValidator)).reduce(flatten, []))
    if (validationErrors.length > 0)
        return Promise.resolve({
            values: [],
            validationErrors
        })
    else return Promise.all([
        new Promise(resolve => resolve(mergeArrayToMap(onetimeArray?onetimeArray:[], o=>o.name, o=>o.allocation, merge))),
        new Promise(resolve => resolve(mergeArrayToMap(monthlyArray?monthlyArray:[], o=>o.name, o=>o.allocation, merge))),
    ]).then(results => {
        const [onetime, monthly] = results
        return deposit(monthly, onetime, deposits)
    }).then(result =>{
        const values = Object.entries(result).map(portfolio)
        return {
            values,
            validationErrors
        }
    })
}
export const depositService0 = (monthly, onetime, deposits):Promise<any> => {
    const validationErrors = validate(monthly, planValidator)
        .concat(validate(onetime, planValidator))
    if (validationErrors.length > 0)
        return Promise.resolve({
            values: [],
            validationErrors
        })
    else return deposit(monthly, onetime, deposits)
        .then(result => {
            const values = Object.entries(result).map(portfolio)
            return {
                values,
                validationErrors
            }
        })
}
/**
 * main backend function that handles deposits given a monthly plan,
 * one-time plan, and a list of deposits
 * @param monthly plan for recurring deposits stored as a map of 'portfolio-name':'quantity'
 * @param onetime plan for single deposit stored as a map of 'portfolio-name':'quantity'
 * @param deposits represents a series of inbound bank transfers
 * @returns a map containing 'portfolio-name':'quantity-allocated'
 */
export const deposit = (monthly, onetime, deposits) => {
    return Promise.all([
        new Promise(resolve => resolve(deposits.reduce((sum,curr) => sum + curr, 0))),
        new Promise(resolve => resolve(total(onetime))),
        new Promise(resolve => resolve(empty(monthly))),
    ]).then((result: [any, any, boolean]) => {
        const [funds, totalOnetime, emptyMonthly] = result
        const onceFund = computeOnceFund(funds, totalOnetime, emptyMonthly)
        const monthFund = computeMonthFund(funds, onceFund)
        return Promise.all([
            new Promise(resolve => resolve(distributeProportionally(onceFund, onetime))),
            new Promise(resolve => resolve(distributeProportionally(monthFund, monthly)))
        ])
    }).then(result => {
        const [onetimeAllocation, monthlyAllocation] = result
        return mergeMap(onetimeAllocation, monthlyAllocation, merge)
    })
}
/**
 * function return the plan based on monthly field
 * @param plans deposit plans submitted
 * @param findMonthly set true to find a monthly plan
 * @returns first plan in the list satisfying the findMonthly param
 */
export const getPlan = (plans, findMonthly=false) => {
    const plan = plans.find(plan => plan.monthly==findMonthly)
    return plan ? plan.portfolios : {}
}
/**
 * used to compute the funds that will be allocated to the one-time portfolio deposits
 * @param funds amount available for allocation
 * @param onceMax maximum that can be allocated to the one-time deposit plan
 * @param noMonthPlan indicates unavailability of the monthly deposit plan
 */
export const computeOnceFund = (funds, onceMax, noMonthPlan=false) => {
    if (noMonthPlan && funds >= 0 && onceMax >= 0) return funds
    else if (funds >= 0 && onceMax >= 0) return funds > onceMax ? onceMax : funds
    else return 0
}
/**
 * used to compute the funds that will be allocated to the monthly portfolio deposits
 * @param funds amount available for allocation
 * @param onceFund amount used for the one-time deposit plan
 * @returns the funds allocated to the monthly portfolio deposits - zero if the computed amount is below zero
 */
export const computeMonthFund = (funds, onceFund) => {
    const monthFund = funds - onceFund
    return monthFund > 0 ? monthFund : 0 // possibly 0, but should not be negative
}
export const total = (plan) => {
    return <number>Object.values(plan)
        .filter(v => !isNaN(+v))
        .reduce((acc: number, curr: number)  => format2dp(acc + Number(curr)), 0)
}
/**
 * function to distribute given funds proportionally across a given plan
 * @param funds to be distributed
 * @param plan containing different fund distribution
 * @returns map containing proportionally distributed funds
 */
export const distributeProportionally = (funds, plan) => {
    const planTotal = total(plan)
    return Object.entries(plan)
        .filter(([,v]) => !isNaN(+v))
        .reduce((acc, [k, v]: [string, number]) => {
            acc[k] = format2dp(v * funds / planTotal)
            return acc
        }, {})
}
export const merge = (a1, a2) => format2dp(a1+a2)
export const portfolio = ([k,v]) => {return {name: k, allocation: v}}
export const planValidator = ([k,v]) => {
    if (v < 0)  {
        const reason = '< 0'
        return  {property:k, value:v, reason}
    }
}
export const portfolioValidator = ([k,v]) => {
    if (k == 'allocation' && +v < 0) {
        const reason = '< 0'
        return  {property:k, value:v, reason}
    }
    // other validations for different keys
}
