#!/usr/bin/env node
import { delay } from "./Delay"
import { createInterface } from "readline"
import { stdout, env } from "process"

/**
 * This is a script written to behave similarly to ExifTool or GraphicsMagick's
 * batch-command modes. It is used for integration tests.
 */

function stripPrefix(s: string, prefix: string): string {
  return (s.startsWith(prefix)) ? s.slice(prefix.length) : s
}

const rl = createInterface({
  input: process.stdin
})

const newline = env.newline === "crlf" ? "\r\n" : "\n"

function write(s: string): void {
  stdout.write(s + newline)
}

const failrate = (env.failrate == null) ? 0 : parseFloat(env.failrate!)
const rng = env.rngseed ? require("seedrandom")(env.rngseed) : Math.random
let last = Promise.resolve()

async function onLine(line: string): Promise<void> {
  const r = rng()
  if (r < failrate) {
    console.error("EUNLUCKY: r: " + r.toFixed(2) + ", failrate: " + failrate.toFixed(2) + ", seed: " + env.rngseed)
    return
  }
  line = line.trim()
  if (line.startsWith("flaky ")) {
    const flakeRate = parseFloat(stripPrefix(line, "flaky "))
    write("flaky response (r: " + r.toFixed(2) + ", flakeRate: " + flakeRate.toFixed(2) + ")")
    if (r < flakeRate) {
      write("FAIL")
    } else {
      write("PASS")
    }
  } else if (line.startsWith("upcase ")) {
    write(stripPrefix(line, "upcase ").trim().toUpperCase())
    write("PASS")
  } else if (line.startsWith("downcase ")) {
    write(stripPrefix(line, "downcase ").trim().toLowerCase())
    write("PASS")
  } else if (line.startsWith("sleep ")) {
    const millis = parseInt(stripPrefix(line, "sleep").trim(), 10)
    await delay(millis)
    write("slept " + millis)
    write("PASS")
  } else if (line === "version") {
    write("v1.2.3")
    write("PASS")
  } else if (line.trim() === "exit") {
    process.exit(0)
  } else if (line.startsWith("stderr")) {
    console.error("Error: " + line)
    write("PASS")
  } else {
    console.error("COMMAND MISSING for input", line)
    write("FAIL")
  }
  return
}

rl.on("line", (line) => last = last.then(() => onLine(line)))
