import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Studio = () => {
  const { id: sessionId } = useParams()
  const navigate = useNavigate()
  
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [stream, setStream] = useState(null)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  const videoRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)
  
  // Initialize camera and microphone
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        })
        
        setStream(mediaStream)
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (err) {
        console.error('Error accessing media devices:', err)
        setError('Could not access camera or microphone. Please check your permissions.')
      }
    }
    
    initializeMedia()
    
    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])
  
  const startRecording = () => {
    if (!stream) return
    
    chunksRef.current = []
    
    const options = { mimeType: 'video/webm;codecs=vp9,opus' }
    try {
      mediaRecorderRef.current = new MediaRecorder(stream, options)
    } catch (e) {
      console.error('MediaRecorder error:', e)
      
      // Try with a more compatible mime type
      try {
        mediaRecorderRef.current = new MediaRecorder(stream)
      } catch (err) {
        setError('Recording is not supported in this browser')
        return
      }
    }
    
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunksRef.current.push(event.data)
      }
    }
    
    mediaRecorderRef.current.start(1000) // Collect data every second
    setIsRecording(true)
    
    // Start timer
    setRecordingTime(0)
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)
  }
  
  const stopRecording = () => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') return
    
    mediaRecorderRef.current.stop()
    setIsRecording(false)
    
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    
    // Handle the recorded data once recording is complete
    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      await uploadRecording(blob)
    }
  }
  
  const uploadRecording = async (blob) => {
    try {
      setUploading(true)
      
      const formData = new FormData()
      formData.append('recording', blob, `recording_${sessionId}.webm`)
      
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress(percentCompleted)
        }
      })
      
      console.log('Upload successful:', response.data)
      navigate('/playback')
    } catch (err) {
      console.error('Error uploading recording:', err)
      setError('Failed to upload recording. Please try again.')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="card max-w-lg w-full text-center">
          <h2 className="text-2xl font-semibold text-error mb-4">Error</h2>
          <p className="mb-6">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Recording Studio</h1>
      <p className="mb-4 text-center text-gray-600">Session ID: {sessionId}</p>
      
      <div className="card mb-8">
        <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
          <video 
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {isRecording && (
              <div className="flex items-center mr-4">
                <div className="w-4 h-4 rounded-full bg-error mr-2 recording-indicator"></div>
                <span className="font-mono">{formatTime(recordingTime)}</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                disabled={!stream || uploading}
                className="btn btn-primary flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <circle cx="12" cy="12" r="10" fill="currentColor" />
                </svg>
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="btn btn-danger flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <rect x="6" y="6" width="12" height="12" fill="currentColor" />
                </svg>
                Stop Recording
              </button>
            )}
          </div>
        </div>
      </div>
      
      {uploading && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-3">Uploading Recording...</h3>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-right text-sm text-gray-600">{uploadProgress}%</p>
        </div>
      )}
      
      <div className="text-center mt-8">
        <button 
          onClick={() => navigate('/playback')}
          className="btn bg-gray-200 hover:bg-gray-300 text-gray-800"
        >
          View All Recordings
        </button>
      </div>
    </div>
  )
}

export default Studio
