import { useEffect, useState, useRef, useContext } from 'react'
import { getDevices } from '../controllers/player';
import { TokenContext } from '../contexts/login';
import { DeviceContext } from '../contexts/device';
import { useNavigate } from 'react-router-dom'
import './CSS/Dropdown.css'

const DropDown = (props) => {
    const [options, setOptions] = useState([]);
    const { saveDevice } = useContext(DeviceContext);
    const navigate = useNavigate();
    const tokenContextValue = useContext(TokenContext);
    const token = tokenContextValue.token !== 400 ? tokenContextValue.token : sessionStorage.getItem('token');
    const selectRef = useRef(null);

    useEffect(() => {
        if (token) {
            if (props.data === 'topSongs') {
                async function findTopSongs() {
                    setOptions(props.topSongs);
                }
                if (props.topSongs) {
                    findTopSongs();
                }
            }
            if (props.data === 'devices') {
                async function findDevices() {
                    setOptions(await getDevices(token));
                }
                findDevices();
            }
        }
    }, [token, props])

    // useEffect(() =>{
    //     if(options === 401){
    //         navigate('/');
    //     }
    // }, [options])

    const optionsList = (options && options !== 'The access token expired' ? options.map((option, index) => (
        <option key={index}>{option.name}</option>
    )) : null)

    function handleSelect() {
        options.map((option) => {
            if (option.name === selectRef.current.value) {
                if (props.data === 'topSongs') {
                    props.setSong(option.uri);
                }
                if (props.data === 'devices') {
                    saveDevice(option.id);
                }
            }
        })
    }

    return (
        <div className='dropdown'>
            <label htmlFor="options" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {props.data == 'topSongs' ? 'Select first song for the playlist' : 'Select device'}
            </label>
            <select ref={selectRef} onChange={handleSelect} id="options" className="bg-gray-50 border border-gray-300 text-gray-900 
            text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
            dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                {props.data === 'devices' ? (
                    <option value={selectRef}>Devices</option>
                ) : (
                    <option value={selectRef}>Top 10 songs</option>
                )}
                {options ? (
                    optionsList
                ) : (
                    <></>
                )}
            </select>
        </div>
    )
}

export default DropDown