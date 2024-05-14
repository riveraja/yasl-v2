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
          const { success } = validUrl.safeParse(inputValue)
          if (success) {
            setIsSubmitDisabled(false) // enable submit button
          }
        }
    }

    async function handleSubmit(event: any) {
        event.preventDefault()
        setLoading(true) // show loading spinner
        await fetch(shortenurl).then((res) => {
          return res.json()
        }).then((val) => {
          setLoading(false) // hide loading spinner
          setOutputValue(val.short_url) // set short url
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