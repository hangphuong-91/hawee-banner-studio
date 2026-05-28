import { BannerProvider } from './context/BannerContext.jsx'
import Studio from './pages/Studio.jsx'

function App() {
  return (
    <BannerProvider>
      <Studio />
    </BannerProvider>
  )
}

export default App
