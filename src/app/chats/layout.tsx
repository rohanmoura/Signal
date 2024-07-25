import React, { FC } from 'react'

const layout: FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div>
            {children}
        </div>
    )
}

export default layout
