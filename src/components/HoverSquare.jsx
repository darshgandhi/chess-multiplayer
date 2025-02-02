import React from 'react'
import '../styles/HoverSquare.css'

function HoverSquare({position}) {
  return (
    <div className={`hover-sqaure square-${position}`}></div>  
  )
}

export default HoverSquare;