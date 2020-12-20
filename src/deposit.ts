export const simpleSum = (a, b) => {
    return a + b
}
export const deposit = (plans, deposits) => {
    const [oncePlan, monthPlan] = plans
    const funds = deposits.reduce((sum, curr) => sum + curr, 0)
    const onceFund = computeOnceFund(funds, oncePlan) // compute one-time plan total allocation first
    const monthFund = computeMonthFund(funds, onceFund) // then compute monthly plan total allocation
    const onceAllocation = distributeProportionally(onceFund, oncePlan)
    const monthAllocation = distributeProportionally(monthFund, monthPlan)
    return sum(onceAllocation, monthAllocation)
}
export const computeOnceFund = (funds, oneTimePlan) => {
    const planTotal = total(oneTimePlan)
    return funds > planTotal ? planTotal : funds
}
export const computeMonthFund = (funds, onceFund) => {
    const monthFund = funds - onceFund
    return monthFund > 0 ? monthFund : 0 // possibly 0, but should not be negative
}
export const sum = (a1, a2) => {
    return Object.entries(a1).concat(Object.entries(a2))
        .reduce((acc, [k, v]) => {
            if (!acc[k]) acc[k] = 0
            acc[k] += v
            return acc
        }, {})
}
export const total = (plan) => {
    return <number>Object.values(plan).reduce((acc: number, curr: number)  => acc + curr, 0)
}
export const distributeProportionally = (funds, plan) => {
    const planTotal = total(plan)
    return Object.entries(plan)
        .reduce((acc, [k, v]: [string, number]) => {
            acc[k] = Math.round(v * funds / planTotal  * 100) / 100
            return acc
        }, {})
}
