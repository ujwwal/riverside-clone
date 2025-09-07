import { useState, useEffect } from 'react'
import axios from 'axios'

const Playback = () => {
  const [recordings, setRecordings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRecording, setSelectedRecording] = useState(null)
  
  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/recordings')
        setRecordings(response.data)
      } catch (err) {
        console.error('Error fetching recordings:', err)
        setError('Failed to load recordings. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchRecordings()
  }, [])
  
  const formatDate = (isoDate) => {
    try {
      const date = new Date(isoDate)
      return date.toLocaleString()
    } catch (e) {
      return 'Unknown date'
    }
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading recordings...</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h2 className="text-2xl font-semibold text-error mb-4">Error</h2>
        <p className="mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    )
  }
  
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Recordings</h1>
      
      {recordings.length === 0 ? (
        <div className="card text-center">
          <h2 className="text-xl font-semibold mb-4">No recordings found</h2>
          <p className="mb-6 text-gray-600">
            You haven't made any recordings yet. Go to the studio to create your first recording.
          </p>
          <a href="/" className="btn btn-primary inline-block">
            Go to Home
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Recording List</h2>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                {recordings.map((recording) => (
                  <div 
                    key={recording.id}
                    onClick={() => setSelectedRecording(recording)}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      selectedRecording?.id === recording.id 
                        ? 'bg-primary text-white' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <p className="font-medium truncate">
                      {recording.filename}
                    </p>
                    <p className="text-sm opacity-80">
                      {formatDate(recording.date)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            {selectedRecording ? (
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">
                  {selectedRecording.filename}
                </h2>
                <p className="mb-4 text-sm text-gray-600">
                  Recorded on {formatDate(selectedRecording.date)}
                </p>
                
                <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                  <video 
                    src={selectedRecording.url}
                    controls
                    className="w-full h-full"
                  />
                </div>
                
                <div className="flex justify-end">
                  <a 
                    href={selectedRecording.url}
                    download={selectedRecording.filename}
                    className="btn bg-gray-200 hover:bg-gray-300 text-gray-800"
                  >
                    Download
                  </a>
                </div>
              </div>
            ) : (
              <div className="card flex items-center justify-center min-h-[40vh] text-center">
                <div>
                  <p className="text-xl mb-2">Select a recording to play</p>
                  <p className="text-gray-600">
                    Click on a recording from the list to view and play it.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Playback
