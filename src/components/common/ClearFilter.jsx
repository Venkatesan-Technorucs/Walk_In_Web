import { Button } from 'primereact/button'
import React from 'react'

const ClearFilter = ({ onClear }) => {
  return (
    <Button label='Clear' className='w-1/12 h-12 text-center bg-gray-100 border-1 border-gray-400 text-black hover:bg-gray-200' onClick={onClear} />
  )
}

export default ClearFilter