import { Button } from 'primereact/button'
import React from 'react'

const ClearFilter = ({ onClear }) => {
  return (
    <Button label='Clear' className='w-1/6 h-12 text-center bg-white border-1 border-gray-400 text-(--primary-color) hover:bg-gray-100' onClick={onClear} />
  )
}

export default ClearFilter