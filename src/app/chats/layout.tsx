import React, { FC } from 'react'

const layout: FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className='bg-red-500'>
            {children}
        </div>
    )
}

export default layout
