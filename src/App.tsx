import { Routes, Route } from 'react-router-dom'
import NotePicker from './pages/NotePicker'
import ResultsPlaceholder from './pages/ResultsPlaceholder'

function App() {
  return (
    <Routes>
      <Route path="/" element={<NotePicker />} />
      <Route path="/results" element={<ResultsPlaceholder />} />
    </Routes>
  )
}

export default App
