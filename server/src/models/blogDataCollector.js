/**
 * @file This file exports the BlogDataCollector class which is used to read
 * the blogdata.txt file and store the data in memory. 
 */

import fs from 'fs'
import readline from 'readline'

/**
 * @class BlogDataCollector
 * @classdesc A class that reads the blogdata.txt file and stores the data in memory.
 */
export class BlogDataCollector {

  /**
   * An array of blog objects.
   */
  blogs = []

  /**
   * An array of words.
   */
  words = []

  /**
   * A boolean that indicates if the data has been loaded.
   */
  dataLoaded = false

  constructor() {
    this.readData()
  }

  /**
   * Ensures that the data has been loaded before returning the blogs.
   * @returns {Promise} - A promise that resolves to the blogs array.
   */
  async getBlogs() {
    await this.ensureDataLoaded()
    return this.blogs
  }

  /**
   * Ensures that the data has been loaded before returning the words.
   * @returns {Promise} - A promise that resolves to the words array.
   */
  async getWords() {
    await this.ensureDataLoaded()
    return this.words
  }

  /**
   * Checks if the data has been loaded. If not, waits for it to be loaded.
   */
  async ensureDataLoaded() {
    // wait for data to be loaded if not
    while (!this.dataLoaded) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  /**
   * Reads the blogdata.txt file and stores the data in memory.
   */
  async readData() {

    const fileStream = fs.createReadStream('./blogdata.txt')
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    })

    for await (const line of rl) {
      const columns = line.split('\t')
      if (this.words.length === 0) {

        this.words = columns.slice(1)
      } else {
        let blog = {
          name: columns[0],
          wordCounts: []
        }

        for (let i = 1; i < columns.length; i++) {
          blog.wordCounts.push(parseInt(columns[i], 10))
        }

        this.blogs.push(blog)
      }
    }
    this.dataLoaded = true
  }


}