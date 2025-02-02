import React from 'react'
import '../styles/Square.css'

function HighlightSquare({selected}) {
  return (
    <div className={`${selected.className} highlight`}></div>  
  )
}

export default HighlightSquare;