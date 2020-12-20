import { expect } from 'chai'
import {computeMonthFund, computeOnceFund, distributeProportionally, simpleSum, sum} from "../../src/deposit"

describe('default suite', () => {
    it('sample test', () => {
        expect(simpleSum(1,2)).to.equal(3)
    })
    it('sum allocations positive', () => {
        expect(sum({'cheese':1, 'chicken':2}, {'cheese':1})).to.eql({'cheese':2, 'chicken':2})
    })
    it('distribute proportionally positive', ()=> {
        expect(distributeProportionally(300.3, {'cheese':1, 'chicken':2})).to.eql({ cheese: 100.1, chicken: 200.2 })
    })
})
describe('compute funds suite', () => {
    it('compute one-time fund positive', () => {
        expect(computeOnceFund(4, {'cheese':1, 'chicken':3})).to.equal(4)
    })
    it('compute one-time fund less positive', () => {
        expect(computeOnceFund(3, {'cheese':1, 'chicken':3})).to.equal(3)
    })
    it('compute one-time fund more positive', () => {
        expect(computeOnceFund(5, {'cheese':1, 'chicken':3})).to.equal(4)
    })
    it('compute monthly fund positive', () => {
        expect(computeMonthFund(4, 4)).to.equal(0)
    })
    it('compute monthly fund positive', () => {
        expect(computeMonthFund(4, 3)).to.equal(1)
    })
})
