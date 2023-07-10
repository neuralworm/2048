import DarkModeIcon from '@mui/icons-material/DarkMode'
import TouchAppIcon from '@mui/icons-material/TouchApp';
interface Props {
    toggleDark: Function,
    dark: boolean,
    touch: boolean
}
const SettingsView = ({ toggleDark, dark, touch }: Props) => {
    return (
        <div className="absolute mt-8 top-0 left-0 right-0 flex flex-row justify-center items-center gap-8 ">
            <button className='bg-white rounded-lg w-16 h-8' onClick={() => toggleDark()}>
                <DarkModeIcon color={dark ? "disabled" : "primary"}></DarkModeIcon>
            </button>
            <button className='bg-white rounded-lg w-16 h-8'>
                <TouchAppIcon color={touch ? "disabled" : "primary"}></TouchAppIcon>
            </button>

        </div>
    )
}
export default SettingsView