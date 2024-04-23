import { ClusterTree } from './components/ClusterTree'

export default async function Home() {
  let clusters = null
  try {
    const res = await fetch('http://localhost:3030/clusters', { cache: 'no-cache' })

    if (!res.ok) {
      return <div className="min-h-screen flex flex-col items-center px-4 py-8 bg-gray-700 text-white">
        Error fetching clusters
      </div>
    }

    clusters = await res.json()

  } catch (error) {
    console.error(error)
    return <div className="min-h-screen flex flex-col items-center px-4 py-8 bg-gray-700 text-white">
      Error loading clusters
    </div>
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8 bg-gray-800 text-white">
      <h4 className='text-4xl mb-4'>Clusters of Blogs</h4>
      <div className='w-full max-w-2xl p-5 border border-gray-700 shadow-md bg-gray-700 bg-opacity-80'>
        {clusters && <ClusterTree clusters={clusters} />}
      </div>
    </main>
  )
}