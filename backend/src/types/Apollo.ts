import express from 'express'
import { DataLoaders } from '../providers/DataLoaders'

export type Context = {
  req: express.Request
  loaders: DataLoaders
}
