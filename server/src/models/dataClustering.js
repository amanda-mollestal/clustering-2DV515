/**
 * @class DataClustering
 * @classdesc A class that clusters the blog data.
 */
export class DataClustering {

  /**
   * An array of blog objects.
   */
  blogs = []

  /**
   * An array of words.
   */
  words = []

  /**
   * The number of clusters.
   * @default 5
   */
  k

  /**
   * The maximum number of iterations.
   * @default 20
   * @description The algorithm will stop if the assignments are identical to the previous iteration.
   */
  maxIterations

  /**
   * An array of centroids.
   */
  centroids = []

  /**
   * An array of assignments.
   * @description The index of the array corresponds to the index of the blog in the blogs array.
   */
  assignments = []

  /**
   * An array of objects containing the min and max count for each word.
   * @description The index of the array corresponds to the index of the word in the words array.
  */
  minMax = []

  /**
   * An object containing the cluster results.
   */
  clusterResults = {}

  constructor(blogs, words, k = 5, maxIterations = 20) {
    this.blogs = blogs
    this.words = words
    this.k = k
    this.maxIterations = maxIterations
    this.centroids = []
    this.assignments = []
    this.minMax = this.calculateMinMax()
    this.clusterResults = {}
    this.cluster()
  }

  /**
   * Gets the cluster results.
   * @returns {Object} - The cluster results.
   */
  getClusters() {
    return this.clusterResults
  }

  /**
   * Calculates the min and max count for each word.
   * @returns {Object[]} - An array of objects containing the min and max count for each word.
   */
  calculateMinMax() {
    // array to store the min and max for each word
    const minMax = this.words.map(() => ({ min: Infinity, max: -Infinity }))

    // find the min and max counts for each word
    this.blogs.forEach(blog => {
      blog.wordCounts.forEach((count, i) => {
        if (count < minMax[i].min) minMax[i].min = count
        if (count > minMax[i].max) minMax[i].max = count
      })
    })

    return minMax
  }

  /**
   * Generates a random number between min and max.
   * @param {number} min - The minimum number.
   * @param {number} max - The maximum number.
   * @returns {number} - A random number between min and max.
   */
  randomBetween(min, max) {
    return Math.random() * (max - min) + min
  }

  /**
   * Initializes the centroids.
   * @description The centroids are initialized with random values between the min and max count for each word.
   */
  initializeCentroids() {
    for (let i = 0; i < this.k; i++) {
      const centroid = this.minMax.map(range => {
        // generate a random count within words min and max range
        return this.randomBetween(range.min, range.max)
      })
      this.centroids.push(centroid)
    }
  }

  /**
   * Calculates the Pearson distance between two blogs.
   * @param {Object} blogA - The first blog.
   * @param {Object} blogB - The second blog.
   * @returns {number} - The Pearson distance between the two blogs.
   */
  pearsonDistance(blogA, blogB) {
    let n = this.words.length
    let sumA = 0, sumB = 0, sumAsq = 0, sumBsq = 0, pSum = 0

    for (let i = 0; i < n; i++) {
      let cntA = blogA.wordCounts[i]
      let cntB = blogB.wordCounts[i]
      sumA += cntA
      sumB += cntB
      sumAsq += cntA ** 2
      sumBsq += cntB ** 2
      pSum += cntA * cntB
    }

    let num = pSum - (sumA * sumB / n)
    let den = Math.sqrt((sumAsq - sumA ** 2 / n) * (sumBsq - sumB ** 2 / n))
    return 1.0 - num / den
  }

  /**
   * Assigns each blog to the closest centroid.
   * @description The index of the array corresponds to the index of the blog in the blogs array.
   */
  assignBlogs() {

    // clear the assignments 
    this.assignments = new Array(this.blogs.length).fill(-1)

    this.blogs.forEach((blog, blogIndex) => {
      let minDistance = Infinity // infinity to ensure any first calculated distance will be smaller
      let closestCentroid = -1

      // find the closest centroids
      this.centroids.forEach((centroid, centroidIndex) => {
        // pearson distance between the current blog and centroid
        let distance = this.pearsonDistance(blog, { wordCounts: centroid })
        // if the smallest so far, update minDistance and the closest centroid
        if (distance < minDistance) {
          minDistance = distance
          closestCentroid = centroidIndex
        }
      })

      this.assignments[blogIndex] = closestCentroid // assign to closest centroid
    })
  }

  /**
   * Updates the centroids based on the assigned blogs.
   * @description The index of the array corresponds to the index of the centroid in the centroids array.
   * The index of the inner array corresponds to the index of the word in the words array.
   * @returns {number[][]} - An array of arrays containing the updated centroids.
   */
  updateCentroids() {

    // Update each centroid based on the assigned blogs
    this.centroids = this.centroids.map((_, centroidIndex) => {
      // blogs that are assigned to the current centroid
      let blogsAssigned = this.blogs.filter((_, blogIndex) => this.assignments[blogIndex] === centroidIndex)

      // if no blogs , return an array of zeros
      if (blogsAssigned.length === 0) {
        return new Array(this.words.length).fill(0)
      }

      // new centroid with zero values
      let newCentroid = new Array(this.words.length).fill(0)

      // sum of word counts for each centroid
      blogsAssigned.forEach(blog => {
        blog.wordCounts.forEach((count, wordIndex) => {
          newCentroid[wordIndex] += count
        })
      })

      // average for the new centroid
      return newCentroid.map(wordCount => wordCount / blogsAssigned.length)
    })

  }

  /**
   * Clusters the blogs.
   * @description The algorithm will stop if the assignments are identical to the previous iteration.
   * The cluster results are stored in the clusterResults object.
   */
  cluster() {
    console.time('Clustering Time')

    this.initializeCentroids()
    let previousAssignments = []

    for (let i = 0; i < this.maxIterations; i++) {
      this.assignBlogs()
      console.log(`Iteration ${i + 1}`)
      // if the new assignments are identical to the previous 
      if (this.assignments.every((value, index) => value === previousAssignments[index])) {
        break
      }

      this.updateCentroids()
      previousAssignments = [...this.assignments] // update for the next iteration
    }


    let clusterResults = {}
    for (let i = 0; i < this.k; i++) {
      clusterResults[i] = { count: 0, blogs: [] }
    }

    // group blogs by their assigned cluster
    this.assignments.forEach((clusterIndex, blogIndex) => {
      clusterResults[clusterIndex].blogs.push(this.blogs[blogIndex].name)
      clusterResults[clusterIndex].count++
    })

    this.clusterResults = clusterResults
    console.timeEnd('Clustering Time')
    console.timeEnd('Complete Time')
  }


}
