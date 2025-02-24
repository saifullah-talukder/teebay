import { useMutation } from '@apollo/client'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { z } from 'zod'
import PasswordInputField from '../components/form/PasswordInputField'
import TextInputField from '../components/form/TextInputfield'
import PrimaryActionButton from '../components/shared/PrimaryActionButton'
import { SIGN_IN } from '../graphql/Auth'
import { client, updateAuthToken } from '../graphql/client'
import { GET_USER } from '../graphql/User'
import { useSignInStore } from '../store/auth/SignInStore'
import { User } from '../types/graphql'

const SignIn: React.FC = () => {
  const { state, isValidated, errorMessage, setSignInState, reset } = useSignInStore()
  const [signin, { loading, error }] = useMutation(SIGN_IN)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!isValidated) {
      toast.error(`Error trying to sign in. ${errorMessage}`)
      return
    }

    try {
      const response = await signin({ variables: state })

      const userData = response.data.signin.user as User
      updateAuthToken(response.data.signin.token)

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

      toast.success(`Welcome, ${userData.firstName} ${userData.lastName}`)
      reset()
      navigate('/product/all')
    } catch (error) {
      console.error(`Sign in failed. ${(error as Error).message}`)
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
        <h1 className="text-3xl text-center">SIGN IN</h1>
        <form className="border border-blue-600 mt-6 p-4 rounded-md w-96 flex flex-col gap-y-4" onSubmit={handleSubmit}>
          <TextInputField
            label="Email"
            placeholder="Email"
            validationSchema={z.string().email()}
            onTextChange={text => setSignInState('email', text)}
          />
          <PasswordInputField label="Password" onTextChange={text => setSignInState('password', text)} />
          <PrimaryActionButton
            type="submit"
            label="Sign In"
            onClick={e => {
              e.preventDefault()
              handleSubmit()
            }}
            isLoading={loading}
          />
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
