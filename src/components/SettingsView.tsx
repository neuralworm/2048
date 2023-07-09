import DarkModeIcon from '@mui/icons-material/DarkMode'

interface Props {
    toggleDark: Function,
    dark: boolean
}
const SettingsView = ({ toggleDark, dark }: Props) => {
    return (
        <div className="absolute top-0 left-0 right-0 flex flex-row justify-center items-center gap-8 ">
            <button className='bg-neutral-400 rounded-full' onClick={() => toggleDark()}>
                <DarkModeIcon></DarkModeIcon>
            </button>
            <button>Swipe Controls</button>

        </div>
    )
}
export default SettingsView