'use client'

import { useEffect, useState, useMemo, useRef } from 'react'

type ChatData = {
  id: string
  question: string
  answer: string
}

export default function Chatbot() {
  const [search, setSearch] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [loader,setLoader] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [data, setData] = useState<ChatData[]>([
    { id: '1', question: 'what is cat', answer: 'cat is a animal' },
    {
      id: '2',
      question: 'is cat a pet animal',
      answer: 'yes, cat is a pet animal',
    },
  ])
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const savedSearch = sessionStorage.getItem('chatbot-search')
    const savedData = sessionStorage.getItem('chatbot-data')

    if (savedSearch !== null) setSearch(savedSearch)
    if (savedData !== null) {
      try {
        setData(JSON.parse(savedData))
      } catch {
        sessionStorage.removeItem('chatbot-data')
      }
    }

    setIsLoaded(true)
    searchRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!isLoaded) return

    localStorage.setItem('chatbot-search', search)
    localStorage.setItem('chatbot-data', JSON.stringify(data))
  }, [search, data, isLoaded])

  const fetchData = async () => {
    const question = search.trim()
    if (!question) return

    try {
        setLoader(true)
      const res = await fetch(`/api/chatbot?query=${question}`)
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`)
      }
      const result: ChatData = await res.json()
      setData((prev) => [
        ...prev,
        { ...result, id: result.id, question },
      ])
      setSearch('')
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new Error(message)
    } finally {
      setLoader(false)
    }
  }

  const copyAnswer = (item: ChatData) => {
    console.log(item.answer)
    setCopiedId(item.id)
  }

  const chatMemo = useMemo(() => {
    return data
  },[data])

  if(loader) {
    return (<>Loading..</>)
  }

  return (
    <>
      {chatMemo.length > 0 && (
        <div style={{margin:'20px', overflowY:'scroll'}}>
          {chatMemo.map((item) => (
            <div key={item.id}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <p style={{ backgroundColor: 'lightgray', padding: '8px 12px', borderRadius: '8px' }}>
                  {item.question}
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <p>{item.answer}</p>
                <button
                  type="button"
                  onClick={() => copyAnswer(item)}
                  style={{ alignSelf: 'center', height: 'fit-content', marginLeft: '8px' }}
                >
                  {copiedId === item.id ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div>
        <input
        type="text"
        placeholder="Enter Text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        ref={searchRef}
      />
      {search.trim() && !loader && (
        <span style={{ marginLeft: '8px', color: '#6b7280', fontSize: '14px' }}>
          Typing...
        </span>
      )}
      <button
        onClick={fetchData}
        disabled={!search.trim()}
        style={{
          backgroundColor: search.trim() ? '#2563eb' : '#d1d5db',
          color: search.trim() ? '#ffffff' : '#6b7280',
          cursor: search.trim() ? 'pointer' : 'not-allowed',
          padding:'5px'
        }}
      >
        Send
      </button>
      </div>
    </>
  )
}
