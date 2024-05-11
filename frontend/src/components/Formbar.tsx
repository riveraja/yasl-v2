import './Formbar.css'
import { useState } from 'react'

export function FormBar() {
    const [inputValue, setInputValue] = useState('')
    const [outputValue, setOutputValue] = useState('')
    const [isShown, setIsShown] = useState(false)
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)

    const shortenurl = `http://localhost:8000/api/v1/shorten?url=${inputValue}`

    function copy(text: string) {
        navigator.clipboard.writeText(text)
    }

    async function onInputChange(event: any) {
        setInputValue(event.target.value)
        if (event.target.value === '')  {
        setIsSubmitDisabled(true)
        setIsShown(false)
        } else {
        setIsSubmitDisabled(false)
        }
    }

    async function handleSubmit(event: any) {
        event.preventDefault()
        await fetch(shortenurl).then((res) => {
        return res.json()
        }).then((val) => {
        setOutputValue(val.short_url)
        setIsShown(true)
        setIsSubmitDisabled(true)
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
              {isShown && <p>Shortened URL: <span onClick={() => copy(outputValue)}>{outputValue}</span></p>}
            </div>
          </div>
        </>
    )
}