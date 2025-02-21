import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import PrimaryActionButton from '../components/button/PrimaryActionButton'
import PasswordInputField from '../components/form/PasswordInputField'
import TextInputField from '../components/form/TextInputfield'
import { useSignInStore } from '../store/auth/SignInStore'

const SignIn: React.FC = () => {
  const { state, setSignInState } = useSignInStore()
  const navigate = useNavigate()

  const handleSubmit = () => {
    console.log(state)
  }

  return (
    <div className="min-h-screen flex justify-center bg-gray-100">
      <div className="flex flex-col items-center mt-20">
        <h1 className="text-3xl text-center">SIGN IN</h1>
        <form className="border border-blue-600 mt-6 p-4 rounded-md w-96 flex flex-col gap-y-4" onSubmit={handleSubmit}>
          <TextInputField
            label="Email"
            placeholder="Email"
            validationSchema={z.string().email()}
            onTextChange={text => setSignInState('email', text)}
          />
          <PasswordInputField label="Password" onTextChange={text => setSignInState('password', text)} />
          <PrimaryActionButton type="submit" label="Sign In" onClick={handleSubmit} />
          <div className="flex justify-center items-center">
            <span>Don't have an account?</span>
            <PrimaryActionButton
              className="bg-transparent hover:bg-transparent shadow-none text-blue-600 h-auto w-auto text-lg"
              label="Sign Up"
              onClick={() => navigate('/signup')}
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignIn
