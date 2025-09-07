import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  const startStudio = () => {
    // Generate a random session ID
    const sessionId = Math.random().toString(36).substring(2, 9)
    navigate(`/studio/${sessionId}`)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Riverside Clone</h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          A simplified version of Riverside.fm for recording high-quality audio and video directly in your browser.
        </p>
      </div>
      
      <div className="card text-center max-w-lg w-full">
        <h2 className="text-2xl font-semibold mb-6">Ready to start recording?</h2>
        <p className="mb-8 text-gray-600">
          Click the button below to create a new recording studio.
        </p>
        <button 
          onClick={startStudio}
          className="btn btn-primary text-lg px-8 py-3"
        >
          Start Studio
        </button>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        <div className="card text-center">
          <h3 className="text-xl font-semibold mb-3">Record</h3>
          <p className="text-gray-600">
            Create high-quality recordings using your camera and microphone.
          </p>
        </div>
        
        <div className="card text-center">
          <h3 className="text-xl font-semibold mb-3">Save</h3>
          <p className="text-gray-600">
            Your recordings are saved securely on the server.
          </p>
        </div>
        
        <div className="card text-center">
          <h3 className="text-xl font-semibold mb-3">Playback</h3>
          <p className="text-gray-600">
            Review and play back your recordings anytime.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home
