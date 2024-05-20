import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const href_array: Array<string> = (window.location.href).split('/')
const href_filtered = href_array.filter(e => e)

if (href_filtered.length == 2) {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

if (href_filtered.length == 3) {
  const apiUrl = `${import.meta.env.VITE_API_PREFIX}/longurl?short=${href_filtered[2]}`
  await fetch(apiUrl).then(function(response) {
    return response.text()
  }).then(function(data) {
    window.location.href = data
  })
}
