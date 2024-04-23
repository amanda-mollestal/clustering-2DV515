/**
 * @file This file exports the BlogController class which is used to handle
 * requests to the /clusters endpoint.
 */

import { BlogDataCollector } from '../models/blogDataCollector.js'
import { DataClustering } from '../models/dataClustering.js'

/**
 * @class BlogController
 * @classdesc A class that handles requests to the /clusters endpoint.
 */
export class BlogController {

  /**
   * An instance of the BlogDataCollector class.
   */
  blogData

  /**
   * An instance of the DataClustering class.
   */
  dataClustering

  constructor() {
    this.preformClustering()
  }

 /**
  * Initializes the BlogDataCollector and DataClustering classes.
  */
  async preformClustering() {
    console.time('Complete Time')
    this.blogData = new BlogDataCollector()
    const blogs = await this.blogData.getBlogs()
    const words = await this.blogData.getWords()
    this.dataClustering = new DataClustering(blogs, words)
  }

  /**
   * Gets the clusters from the DataClustering class and sends them to the client.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} - The response object.
   * @returns {Error} - Error if the clusters are not found.
   */
  getClusters(req, res) {
    const clusters = this.dataClustering.getClusters()

    if (!clusters) {
      return res.status(404).json('Clusters not found')
    }

    res.status(200).json(clusters)
  }

}