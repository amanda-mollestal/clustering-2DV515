'use client'

import React, { useState } from 'react'


export function ClusterTree({ clusters }) {
  const [expanded, setExpanded] = useState({})

  const toggleNode = (node) => {
    setExpanded({ ...expanded, [node]: !expanded[node] })
  }

  if (clusters.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <div className="mt-3">
      {Object.entries(clusters).map(([key, value]) => (
        <div key={key} className="p-2 overflow-hidden pl-5">
          <div 
            onClick={() => toggleNode(key)} 
            className="cursor-pointer font-semibold text-xl hover:text-gray-900 transition-colors"
          >
            Cluster {parseInt(key, 10) + 1} (Count: {value.count})
          </div>
          <div 
            className={`transition-all duration-500 ease-in-out ${expanded[key] ? 'max-h-96 opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95'}`}
          >
            <ul className="list-disc pl-6 mt-2">
              {value.blogs.map((blog, index) => (
                <li key={index} className="mt-1 transition-all delay-150 duration-500">
                  {blog}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}


