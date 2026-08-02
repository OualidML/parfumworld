import { Routes, Route } from 'react-router-dom'
import NotePicker from './pages/NotePicker'
import Results from './pages/Results'
import PerfumeDetails from './pages/PerfumeDetails'

function App() {
  return (
    <Routes>
      <Route path="/" element={<NotePicker />} />
      <Route path="/results" element={<Results />} />
      <Route path="/perfume/:id" element={<PerfumeDetails />} />
    </Routes>
  )
}



export default App
