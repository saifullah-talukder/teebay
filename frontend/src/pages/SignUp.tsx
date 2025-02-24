import { useMutation } from '@apollo/client'
import { omit } from 'lodash'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { z } from 'zod'
import PasswordInputField from '../components/form/PasswordInputField'
import TextInputField from '../components/form/TextInputfield'
import PrimaryActionButton from '../components/shared/PrimaryActionButton'
import { SIGN_UP } from '../graphql/Auth'
import { client } from '../graphql/client'
import { GET_USER } from '../graphql/User'
import { useSignUpStore } from '../store/auth/SignUpStore'
import { phoneSchema } from '../utils/Validation'
import { User } from '../types/graphql'

const SignUp: React.FC = () => {
  const { state, isValidated, errorMessage, setSignUpState, reset } = useSignUpStore()
  const [signup, { loading, error }] = useMutation(SIGN_UP)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!isValidated) {
      toast.error(`Error trying to sign up. ${errorMessage}`)
      return
    }

    try {
      const response = await signup({
        variables: { ...omit(state, 'confirmPassword') },
      })

      const userData = response.data.signup as User

      client.cache.writeQuery({
        query: GET_USER,
        variables: { id: userData.id },
        data: {
          user: {
            __typename: 'User',
            ...userData,
          },
        },
      })

      toast.success('Sign up successful')
      reset()
      navigate('/signin')
    } catch (error) {
      console.error(`Sign up failed. ${(error as Error).message}`)
    }
  }

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

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

          <PrimaryActionButton
            type="submit"
            label="Sign Up"
            onClick={e => {
              e.preventDefault()
              handleSubmit()
            }}
            isLoading={loading}
          />
          <div className="flex justify-center items-center">
            <span>Already have an account?</span>
            <PrimaryActionButton
              type="button"
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
