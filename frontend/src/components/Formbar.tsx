import './Formbar.css'
import { useState } from 'react'
import { z } from 'zod'

export function FormBar() {
    const [inputValue, setInputValue] = useState('') // long url from user
    const [outputValue, setOutputValue] = useState('') // generated short url
    const [obj, setObj] = useState({
      showResult: false,
      showLoading: false,
      disableSubmit: true
    })
    const validUrl = z.string().url()

    const shortenurl = `${import.meta.env.VITE_API_PREFIX}/shorten?url=${inputValue}`

    function copy(text: string) {
        navigator.clipboard.writeText(text)
    }

    async function onInputChange(event: any) {
        setInputValue(event.target.value)
        if (event.target.value === '')  {
          setObj({
            ...obj,
            disableSubmit: true,
            showResult: false
          })
        } else {
          if (validUrl.safeParse(event.target.value).success) {
            setObj({
              ...obj,
              disableSubmit: false
            })
          }
        }
    }

    async function handleSubmit(event: any) {
        event.preventDefault()
        setObj({
          ...obj,
          showLoading: true
        })
        await fetch(shortenurl, {
          signal: AbortSignal.timeout(5000)
        }).then((res) => {
          return res.json()
        }).then((data) => {
          setObj({
            ...obj,
            showLoading: false
          })
          setOutputValue(data.result) // set short url
          setObj({
            ...obj,
            showResult: true,
            disableSubmit: true
          })
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
                  disabled={obj.disableSubmit}
                  >Shorten</button>
            </form>
            <div>
              {obj.showLoading && <p>Loading...</p>}
              {obj.showResult && <p>Shortened URL: <span onClick={() => copy(outputValue)}>{outputValue}</span></p>}
            </div>
          </div>
        </>
    )
}