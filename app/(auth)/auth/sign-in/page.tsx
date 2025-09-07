import SignInFormClient from '@/features/auth/components/sign-in-form-client'
import Image from 'next/image'
import React from 'react'

const SignInPage = () => {
  return (
    <div className='space-y-6 flex  items-center justify-between gap-32 '>
        <Image src={"/undraw_login_weas.svg"} alt='logo ' height={400} width={400}/>
        <SignInFormClient/>
    </div>
  )
}

export default SignInPage