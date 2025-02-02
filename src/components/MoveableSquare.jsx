import React from 'react'
import '../styles/MoveableSquare.css'

function MoveableSquare({position}) {
  return (
    <div className={`moveable-square square-${position}`}></div>   
  )
}

export default MoveableSquare;