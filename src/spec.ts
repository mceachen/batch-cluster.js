import { env } from "process"

import { NoLogger, setLogger } from "./Logger"

const _chai = require("chai")
_chai.use(require("chai-string"))
_chai.use(require("chai-as-promised"))
_chai.use(require("chai-withintoleranceof"))

export { expect } from "chai"

require("source-map-support").install()

// Tests should be quiet unles LOG is set
if (!!env.LOG) {
  setLogger(
    new Proxy(console, {
      get: (target: any, p: PropertyKey, _receiver: any): any => {
        return (...args: any[]) => target[p](new Date().toISOString() + ": " + args[0], ...args.slice(1))
      }
    })
  )
} else {
  setLogger(NoLogger)
}

export const parser = (ea: string) => ea.trim()

process.on("unhandledRejection", (reason: any) => {
  console.error("unhandledRejection:", reason.stack || reason)
})

export function times<T>(n: number, f: ((idx: number) => T)): T[] {
  return Array(n)
    .fill(undefined)
    .map((_, i) => f(i))
}

// because @types/chai-withintoleranceof isn't a thing (yet)

type WithinTolerance = (
  expected: number,
  tol: number | number[],
  message?: string
) => Chai.Assertion

declare namespace Chai {
  interface Assertion {
    withinToleranceOf: WithinTolerance
    withinTolOf: WithinTolerance
  }
}
