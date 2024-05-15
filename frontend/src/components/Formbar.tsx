import './Formbar.css'
import { useState } from 'react'
import { z } from 'zod'

export function FormBar() {
    const [inputValue, setInputValue] = useState('') // long url from user
    const [outputValue, setOutputValue] = useState('') // generated short url
    const [isShown, setIsShown] = useState(false) // state to show short url in frontend
    const [loading, setLoading] = useState(false) // state to show spinner in frontend
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true) // state on whether submit link is enabled
    const validUrl = z.string().url()

    const shortenurl = `${import.meta.env.VITE_API_PREFIX}/shorten?url=${inputValue}`

    function copy(text: string) {
        navigator.clipboard.writeText(text)
    }

    async function onInputChange(event: any) {
        setInputValue(event.target.value)
        if (event.target.value === '')  {
          setIsSubmitDisabled(true) // disable submit button
          setIsShown(false) // hide short url
        } else {
          if (validUrl.safeParse(event.target.value).success) {
            setIsSubmitDisabled(false) // enable submit button
          }
        }
    }

    async function handleSubmit(event: any) {
        event.preventDefault()
        setLoading(true) // show loading spinner
        await fetch(shortenurl, {
          signal: AbortSignal.timeout(5000)
        }).then((res) => {
          return res.json()
        }).then((data) => {
          setLoading(false) // hide loading spinner
          setOutputValue(data.result) // set short url
          setIsShown(true) // show short url
          setIsSubmitDisabled(true) // disable submit button
        })
    }

    return (
        <>
            <div className='container'>
            <form onSubmit={handleSubmit}>
              <input
                id='longurl_input'
                className='field'
                type="text"
                value={inputValue}
                placeholder='Paste long URL here.'
                onInput={onInputChange}
                />
                <button
                  className='button'
                  type="submit"
                  disabled={isSubmitDisabled}
                  >Shorten</button>
            </form>
            <div>
              {loading && <p>Loading...</p>}
              {isShown && <p>Shortened URL: <span onClick={() => copy(outputValue)}>{outputValue}</span></p>}
            </div>
          </div>
        </>
    )
}