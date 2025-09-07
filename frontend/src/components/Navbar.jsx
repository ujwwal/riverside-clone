import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-primary flex items-center">
          <span>Riverside Clone</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/playback" className="hover:text-primary transition-colors">
            Recordings
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
