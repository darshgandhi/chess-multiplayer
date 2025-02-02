import React from 'react'
import '../styles/Square.css'

function Square({pieceType, colorClass, position}) {
  return (
    <div className={`tile ${pieceType} ${colorClass} square-${position}`}></div>
  )
}

export default Square
