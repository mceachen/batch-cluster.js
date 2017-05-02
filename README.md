# batch-cluster

Support external batch-mode tools within Node.JS.

[![npm version](https://badge.fury.io/js/batch-cluster.svg)](https://badge.fury.io/js/batch-cluster)
[![Build status](https://travis-ci.org/mceachen/batch-cluster.js.svg?branch=master)](https://travis-ci.org/mceachen/batch-cluster.js)
[![Build status](https://ci.appveyor.com/api/projects/status/4564x6lvc8s6a55l/branch/master?svg=true)](https://ci.appveyor.com/project/mceachen/batch-cluster-js/branch/master)

Many command line tools, like ExifTool and GraphicsMagick, support running
arbitrary commands via a "batch mode," which amortizes process spin-up
costs over several, serial request/response pairs, sent via stdin/stdout.

Spinning up N of these child processes on multiprocessor machines gives you
parallelism.

Distributing requests to these processes, monitoring and restarting processes as
needed, and shutting them down appropriately, is what this module gives you.

This package powers
[exiftool-vendored](https://github.com/mceachen/exiftool-vendored.js).

## Changelog

### v0.0.1

* ✨ Extracted implementation and tests from Exiftool Vendored