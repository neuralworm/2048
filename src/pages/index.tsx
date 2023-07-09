import Image from 'next/image'
import { Inter } from 'next/font/google'
import GameView from '@/components/GameView'
import {message} from 'antd'
import {useState} from 'react'
import SettingsView from '@/components/SettingsView'
import { Snackbar } from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode'

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
  const clearMessage = () => {
    toggleAlert(false)
    setMessage("")
  }
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-24 ${inter.className}`}
    >
      <SettingsView dark={dark} toggleDark={toggleDark}></SettingsView>
      <Snackbar anchorOrigin={{vertical: "bottom", horizontal: "center"}} autoHideDuration={1000} open={alert} message={message} onClose={() => clearMessage()}></Snackbar>
     

      <div className="w-full h-full relative flex place-items-center items-center justify-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
       <GameView></GameView>
      </div>

      
    </main>
  )
}
