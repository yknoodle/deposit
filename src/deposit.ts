import {empty, format2dp, mergeMap} from "./utilities";

export const simpleSum = (a, b) => {
    return a + b
}
export const deposit = (monthly, onetime, deposits) => {
    const funds = deposits.reduce((sum, curr) => sum + curr, 0)
    const onceFund = computeOnceFund(funds, onetime, empty(monthly)) // compute one-time plan total allocation first
    const monthFund = computeMonthFund(funds, onceFund) // then compute monthly plan total allocation
    const onceAllocation = distributeProportionally(onceFund, onetime)
    const monthAllocation = distributeProportionally(monthFund, monthly)
    return mergeMap(onceAllocation, monthAllocation, mergeAllocations)
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
export const computeOnceFund = (funds, oneTimePlan, noMonthPlan=false) => {
    if (noMonthPlan) return funds
    const planTotal = total(oneTimePlan)
    return funds > planTotal ? planTotal : funds
}
export const computeMonthFund = (funds, onceFund) => {
    const monthFund = funds - onceFund
    return monthFund > 0 ? monthFund : 0 // possibly 0, but should not be negative
}
export const total = (plan) => {
    return <number>Object.values(plan).reduce((acc: number, curr: number)  => format2dp(acc + curr), 0)
}
export const distributeProportionally = (funds, plan) => {
    const planTotal = total(plan)
    return Object.entries(plan)
        .reduce((acc, [k, v]: [string, number]) => {
            acc[k] = format2dp(v * funds / planTotal)
            return acc
        }, {})
}
export const mergeAllocations = (a1, a2) => format2dp(a1+a2)
export const listPortfolio = ([k,v]) => {return {name: k, allocation: v}}
