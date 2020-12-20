import { expect } from 'chai'
import {computeMonthFund, computeOnceFund, deposit, distributeProportionally, simpleSum} from "../src/deposit"
import {mergeMap} from "../src/utilities";

describe('default suite', () => {
    const oPlan = {
        'monthly': false,
        'portfolios': {'cheese':1, 'chicken':2}
    }
    const mPlan = {
        'monthly': true,
        'portfolios': {'cheese':1, 'chicken':2}
    }
    it('sample test', () => {
        expect(simpleSum(1,2)).to.equal(3)
    })
    it('sum allocations', () => {
        expect(mergeMap({'cheese':1, 'chicken':2}, {'cheese':1}, (v1,v2)=>v1+v2)).to.eql({'cheese':2, 'chicken':2})
    })
    it('distribute proportionally', ()=> {
        expect(distributeProportionally(300, {'cheese':1, 'chicken':2})).to.eql({ cheese: 100, chicken: 200 })
    })
    it('deposit lump sum', () => {
        expect(deposit([oPlan,mPlan], [6])).to.eql({'chicken':4,'cheese':2})
    })
    it('deposit multiple', () => {
        expect(deposit([oPlan,mPlan], [1,1,1,3])).to.eql({'chicken':4,'cheese':2})
    })
    it('deposit excess', () => {
        expect(deposit([oPlan,mPlan], [6.1])).to.eql({'chicken':4.07,'cheese':2.03})
    })
    it('deposit distribute', () => {
        expect(deposit([oPlan,mPlan], [30])).to.eql({'chicken':20,'cheese':10} )
    })
    it('deposit distribute one-time only', () => {
        expect(deposit([oPlan], [30])).to.eql({'chicken':20,'cheese':10} )
    })
    it('deposit distribute one-month only', () => {
        expect(deposit([mPlan], [30])).to.eql({'chicken':20,'cheese':10} )
    })
})
describe('compute funds suite', () => {
    it('compute one-time fund', () => {
        expect(computeOnceFund(4, {'cheese':1, 'chicken':3})).to.equal(4)
    })
    it('compute one-time fund less', () => {
        expect(computeOnceFund(3, {'cheese':1, 'chicken':3})).to.equal(3)
    })
    it('compute one-time fund more with monthly plan', () => {
        expect(computeOnceFund(5, {'cheese':1, 'chicken':3})).to.equal(4)
    })
    it('compute monthly fund', () => {
        expect(computeMonthFund(4, 4)).to.equal(0)
    })
    it('compute monthly fund', () => {
        expect(computeMonthFund(4, 3)).to.equal(1)
    })
    it('compute one-time-fund with no monthly plan', () => {
        expect(computeOnceFund(8, {'cheese':1, 'chicken':3}, true)).to.equal(8)
    })
})
