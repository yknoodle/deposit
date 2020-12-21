import { expect } from 'chai'
import {computeMonthFund, computeOnceFund, deposit, distributeProportionally, simpleSum, total} from "../src/deposit"
import {mergeMap} from "../src/utilities";

describe('default suite', () => {
    it('sample test', () => {
        expect(simpleSum(1,2)).to.equal(3)
    })
    it('sum allocations', () => {
        expect(mergeMap({'cheese':1, 'chicken':2}, {'cheese':1}, (v1,v2)=>v1+v2)).to.eql({'cheese':2, 'chicken':2})
    })
    it('distribute proportionally', ()=> {
        expect(distributeProportionally(300, {'cheese':1, 'chicken':2})).to.eql({ cheese: 100, chicken: 200 })
    })
    it('total up plan quantity', () => {
        expect(total({'cheese':1, 'chicken':2})).to.equal(3)
    })
    it('total up plan quantity with string numerics', () => {
        expect(total({'cheese':1, 'chicken':'2'})).to.equal(3)
    })
})

describe('compute funds suite', () => {
    it('compute one-time fund', () => {
        expect(computeOnceFund(4,4 )).to.equal(4)
    })
    it('compute one-time fund less', () => {
        expect(computeOnceFund(3, 4)).to.equal(3)
    })
    it('compute one-time fund more with monthly plan', () => {
        expect(computeOnceFund(5, 4)).to.equal(4)
    })
    it('one-time fund alpha input 2', () => {
        expect(computeOnceFund('a', 'b')).to.equal(0)
    })
    it('one-time fund alpha input 1', () => {
        expect(computeOnceFund(2, 'b')).to.equal(0)
    })
    it('one-time fund alpha input special char', () => {
        expect(computeOnceFund('#', '$')).to.equal(0)
    })
    it('compute one-time fund with no monthly plan', () => {
        expect(computeOnceFund(8, 4, true)).to.equal(8)
    })
    it('compute monthly fund', () => {
        expect(computeMonthFund(4, 4)).to.equal(0)
    })
    it('compute monthly fund', () => {
        expect(computeMonthFund(4, 3)).to.equal(1)
    })
    it('month fund alpha input 2', () => {
        expect(computeMonthFund('a', 'b')).to.equal(0)
    })
    it('month fund alpha input 1', () => {
        expect(computeMonthFund('a', 1)).to.equal(0)
    })
    it('month fund alpha input string numbers', () => {
        expect(computeMonthFund('1', '1')).to.equal(0)
    })
    it('month fund alpha input special char', () => {
        expect(computeMonthFund('#', '$')).to.equal(0)
    })
})

describe('deposit funds suite', () => {
    const oPlan = { 'cheese':1, 'chicken':2 }
    const mPlan = { 'cheese':1, 'chicken':2 }
    it('deposit lump sum', async () => {
        expect(await deposit(mPlan,oPlan, [6])).to.eql({'chicken':4,'cheese':2})
    })
    it('deposit multiple', async () => {
        expect(await deposit(mPlan,oPlan, [1,1,1,3])).to.eql({'chicken':4,'cheese':2})
    })
    it('deposit excess', async () => {
        expect(await deposit(mPlan,oPlan, [6.1])).to.eql({'chicken':4.07,'cheese':2.03})
    })
    it('deposit distribute', async () => {
        expect(await deposit(mPlan,oPlan, [30])).to.eql({'chicken':20,'cheese':10} )
    })
    it('deposit distribute one-time only', async () => {
        expect(await deposit({},oPlan, [30])).to.eql({'chicken':20,'cheese':10} )
    })
    it('deposit distribute one-month only', async () => {
        expect(await deposit(mPlan, {}, [30])).to.eql({'chicken':20,'cheese':10} )
    })
    // it('negative', async () => {
    //     expect(await deposit({'cheese':-1}, {'cheese':1},[2])).to.eql([{ property: 'cheese', value: -1, reasons: [ 'negative allocation' ] }])
    // })
})
