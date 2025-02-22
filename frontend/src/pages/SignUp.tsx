import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import PrimaryActionButton from '../components/shared/PrimaryActionButton'
import PasswordInputField from '../components/form/PasswordInputField'
import TextInputField from '../components/form/TextInputfield'
import { useSignUpStore } from '../store/auth/SignupStore'
import { phoneSchema } from '../utils/Validation'

const SignUp: React.FC = () => {
  const { state, setSignUpState } = useSignUpStore()
  const navigate = useNavigate()

  const handleSubmit = () => {
    console.log(state)
  }

  return (
    <div className="min-h-screen flex justify-center bg-gray-100">
      <div className="flex flex-col items-center mt-20">
        <h1 className="text-3xl text-center">SIGN UP</h1>
        <form
          className="border border-blue-600 mt-6 p-4 rounded-md w-160 flex flex-col gap-y-4"
          onSubmit={handleSubmit}
        >
          <div className="flex gap-x-4">
            <TextInputField
              className="w-full"
              label="First Name"
              placeholder="First Name"
              validationSchema={z.string().min(1, 'First name must be minimum 1 character long')}
              onTextChange={text => setSignUpState('firstName', text)}
            />
            <TextInputField
              className="w-full"
              label="Last Name"
              placeholder="Last Name"
              validationSchema={z.string().min(1, 'Last name must be minimum 1 character long')}
              onTextChange={text => setSignUpState('lastName', text)}
            />
          </div>
          <TextInputField
            label="Address"
            placeholder="Address"
            validationSchema={z.string().min(3, 'Address must be minimum 3 characters long')}
            onTextChange={text => setSignUpState('address', text)}
          />
          <div className="flex gap-x-4">
            <TextInputField
              className="w-full"
              label="Email"
              placeholder="Email"
              validationSchema={z.string().email()}
              onTextChange={text => setSignUpState('email', text)}
            />
            <TextInputField
              className="w-full"
              label="Phone"
              placeholder="Phone"
              validationSchema={phoneSchema}
              onTextChange={text => setSignUpState('phone', text)}
            />
          </div>
          <div className="flex gap-x-4">
            <PasswordInputField label="Password" onTextChange={text => setSignUpState('password', text)} />
            <PasswordInputField
              label="Confirm Password"
              onTextChange={text => setSignUpState('confirmPassword', text)}
            />
          </div>

          <PrimaryActionButton type="submit" label="Sign Up" onClick={handleSubmit} />
          <div className="flex justify-center items-center">
            <span>Already have an account?</span>
            <PrimaryActionButton
              className="bg-transparent hover:bg-transparent shadow-none text-blue-600 h-auto w-auto text-lg"
              label="Sign In"
              onClick={() => navigate('/signin')}
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp
