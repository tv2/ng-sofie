import { ExponentiallyDelayedReconnectStrategy } from './exponentially-delayed-reconnect-strategy.service'
import { ReconnectStrategy } from './reconnect-strategy.service'

describe(ExponentiallyDelayedReconnectStrategy.name, () => {
    beforeEach(() => jasmine.clock().install())

    afterEach(() => jasmine.clock().uninstall())

    describe('first retry attempt', () => {
        it('does not fire after 0ms', () => {
            const testee: ReconnectStrategy = new ExponentiallyDelayedReconnectStrategy()
            let connectTries = 0
            const connect = () => connectTries++

            testee.disconnected(connect)

            expect(connectTries).toBe(0)
        })

        it('does not fire after 999ms', () => {
            const testee: ReconnectStrategy = new ExponentiallyDelayedReconnectStrategy()
            let connectTries = 0
            const connect = () => connectTries++

            testee.disconnected(connect)
            jasmine.clock().tick(999)

            expect(connectTries).toBe(0)
        })

        it('does fire after 1000ms', () => {
            const testee: ReconnectStrategy = new ExponentiallyDelayedReconnectStrategy()
            let connectTries = 0
            const connect = () => connectTries++

            testee.disconnected(connect)
            jasmine.clock().tick(1000)

            expect(connectTries).toBe(1)
        })

        it('does fire after 1023ms', () => {
            const testee: ReconnectStrategy = new ExponentiallyDelayedReconnectStrategy()
            let connectTries = 0
            const connect = () => connectTries++

            testee.disconnected(connect)
            jasmine.clock().tick(1023)

            expect(connectTries).toBe(1)
        })
    })

    describe('second retry attempt', () => {
        it('does not fire after 0ms', () => {
            const testee: ReconnectStrategy = new ExponentiallyDelayedReconnectStrategy()
            let connectTries = 0
            const connect = () => connectTries++
            testee.disconnected(connect)
            jasmine.clock().tick(1000)

            testee.disconnected(connect)

            expect(connectTries).toBe(1)
        })

        it('does not fire after 3999ms', () => {
            const testee: ReconnectStrategy = new ExponentiallyDelayedReconnectStrategy()
            let connectTries = 0
            const connect = () => connectTries++
            testee.disconnected(connect)
            jasmine.clock().tick(1000)

            testee.disconnected(connect)
            jasmine.clock().tick(3999)

            expect(connectTries).toBe(1)
        })

        it('does fire after 4000ms', () => {
            const testee: ReconnectStrategy = new ExponentiallyDelayedReconnectStrategy()
            let connectTries = 0
            const connect = () => connectTries++
            testee.disconnected(connect)
            jasmine.clock().tick(1000)

            testee.disconnected(connect)
            jasmine.clock().tick(4000)

            expect(connectTries).toBe(2)
        })
    })

    describe('first retry attempt after connected', () => {
        it('does not fire after 0ms', () => {
            const testee: ReconnectStrategy = new ExponentiallyDelayedReconnectStrategy()
            let connectTries = 0
            const connect = () => connectTries++

            testee.disconnected(connect)
            jasmine.clock().tick(2000)
            testee.connected()

            testee.disconnected(connect)

            expect(connectTries).toBe(1)
        })

        it('does not fire after 999ms', () => {
            const testee: ReconnectStrategy = new ExponentiallyDelayedReconnectStrategy()
            let connectTries = 0
            const connect = () => connectTries++

            testee.disconnected(connect)
            jasmine.clock().tick(2000)
            testee.connected()

            testee.disconnected(connect)
            jasmine.clock().tick(999)

            expect(connectTries).toBe(1)
        })

        it('does fire after 1000ms', () => {
            const testee: ReconnectStrategy = new ExponentiallyDelayedReconnectStrategy()
            let connectTries = 0
            const connect = () => connectTries++

            testee.disconnected(connect)
            jasmine.clock().tick(2000)
            testee.connected()

            testee.disconnected(connect)
            jasmine.clock().tick(1000)

            expect(connectTries).toBe(2)
        })
    })
})
