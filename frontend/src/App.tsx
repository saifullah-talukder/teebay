import { Slide, ToastContainer } from 'react-toastify'
import Pages from './components/wrappers/Pages'

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Pages />
      <ToastContainer
        transition={Slide}
        position="top-center"
        toastClassName="rounded-lg"
        progressClassName="h-0.5 bg-primary"
        autoClose={3000}
      />
    </div>
  )
}

export default App
