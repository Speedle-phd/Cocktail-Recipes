import React from 'react'
import { Link } from 'react-router-dom'

const Errorpage = () => {
  return (
    <div className='error-page'>
      <h2>Oops, you reached a dead end.</h2>
      <Link to="/"><button className="fav-btn">Back to Home</button></Link>
    </div>
  )
}

export default Errorpage
