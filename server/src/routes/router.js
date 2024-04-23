/**
 * @file This file routes the requests to the appropriate controller.
 */

import express from 'express'
import createError from 'http-errors'
import { BlogController } from '../controllers/blogController.js'

export const router = express.Router()
const controller = new BlogController()

router.get('/', (req, res) => {
  res.status(200).json('WELCOME TO THE API')
})

router.get('/clusters', (req, res) => {
  controller.getClusters(req, res)
})

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => next(createError(404)))