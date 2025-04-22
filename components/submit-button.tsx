'use client'

import { Loader } from 'lucide-react'
import type { PropsWithChildren } from 'react'
import { useFormStatus } from 'react-dom'

type SubmitButtonProps = PropsWithChildren<unknown>

export const SubmitButton: React.FC<SubmitButtonProps> = ({ children }) => {
    const { pending } = useFormStatus()

    return (
        <button disabled={pending} type="submit" className='bg-black rounded-lg p-4 text-white flex items-center'>
            {pending && <Loader className="animate-spin size-4 mr-2 text-white" />}
            {children}
        </button>
    )
}