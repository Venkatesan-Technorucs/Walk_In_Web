import React from 'react'
import { Card } from 'primereact/card'

const CustomCard = ({ pt, header, children }) => {
  return (
    <Card className={`w-full xs:w-full h-24 xs:h-40 sm:h-32 flex flex-col xs:justify-between p-4 sm:p-6 rounded-2xl border border-gray-400`} pt={pt} header={header}>
      {children}
    </Card>
  )
}

export default CustomCard