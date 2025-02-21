import { useState } from 'react'
import PasswordInputField from '../components/form/PasswordInputField'
import TextInputField from '../components/form/TextInputfield'
import { z } from 'zod'
import PrimaryActionButton from '../components/button/PrimaryActionButton'
import { useNavigate } from 'react-router-dom'

export default function SignIn() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex justify-center bg-gray-100">
      <div className="flex flex-col items-center mt-20">
        <h1 className="text-3xl text-center">SIGN IN</h1>
        <div className="border border-blue-600 mt-6 p-4 rounded-md w-96 flex flex-col gap-y-4">
          <TextInputField
            label="Email"
            placeholder="Email"
            validationSchema={z.string().email()}
            onTextChange={text => setEmail(text)}
          />
          <PasswordInputField label="Password" onTextChange={text => setPassword(text)} />
          <PrimaryActionButton label="Sign In" onClick={() => {}} />
          <div className="flex justify-center items-center">
            <span>Don't have an account?</span>
            <PrimaryActionButton
              className="bg-transparent hover:bg-transparent shadow-none text-blue-600 h-auto w-auto text-lg"
              label="Sign Up"
              onClick={() => navigate('/signup')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
