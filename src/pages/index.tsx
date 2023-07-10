import Image from 'next/image'
import { Inter } from 'next/font/google'
import GameView from '@/components/GameView'
import {message} from 'antd'
import {useState} from 'react'
import SettingsView from '@/components/SettingsView'
import { Snackbar } from '@mui/material'
import Head from 'next/head'
import InfoView from '@/components/infoview/InfoView'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  // ALERTS
  const [message, setMessage] = useState<string>("")
  const [alert, toggleAlert] = useState<boolean>(false)
  // SETTINGS
  const [dark, setDark] = useState(false)
  const toggleDark = () => {
    dark ? setDark(false) : setDark(true)
    toggleAlert(true)
    setMessage(`Theme set to ${dark ? "Dark" : "Light"}.`)
  }
  // TOUCH
  const [touch, setTouch] = useState<boolean>(false)
  const clearMessage = () => {
    toggleAlert(false)
    setMessage("")
  }
  return (
    <main
      className={`flex min-h-full flex-col items-center justify-center py-24 md:p-24 ${inter.className}`}
    >
      {/* HEAD / SEO */}
      <Head>
        <title>Play 2048</title>
        <meta name="description" content="Play 2048 in your broowser for free.  Check leaderboards and previous high scores." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      </Head>

      <SettingsView touch={touch} dark={dark} toggleDark={toggleDark}></SettingsView>
      <Snackbar anchorOrigin={{vertical: "bottom", horizontal: "center"}} autoHideDuration={1000} open={alert} message={message} onClose={() => clearMessage()}></Snackbar>
     

      <div className="w-full h-full relative flex place-items-center flex-col items-center justify-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
       <GameView></GameView>
       <InfoView></InfoView>
      </div>

      
    </main>
  )
}
