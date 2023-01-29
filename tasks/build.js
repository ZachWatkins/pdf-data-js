#!/usr/bin/env node
const { Build } = require('../src/build')
const config = require('../package.json')?.config?.build || {}
new Build(config)
