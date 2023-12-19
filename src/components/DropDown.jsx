import './CSS/Dropdown.css'
import { useEffect, useState, useRef, useContext } from 'react'
import { getDevices } from '../controllers/player';
import { TokenContext } from '../contexts/login';
import { DeviceContext } from '../contexts/device';
import { useNavigate } from 'react-router-dom'
import SpotyButton from './SpotyButton';
import { ColorRing } from 'react-loader-spinner';

const DropDown = (props) => {
    const [options, setOptions] = useState([]);
    const [spotyClicked, setSpotyClicked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { saveDevice, deviceName } = useContext(DeviceContext);
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
                    setIsLoading(true);
                    if (spotyClicked) {
                        await new Promise((resolve) => setTimeout(resolve, 7000));
                        setOptions(await getDevices(token));
                    } else {
                        setOptions(await getDevices(token));
                    }
                    setIsLoading(false);
                    setSpotyClicked(false);
                }
                findDevices();
            }
        }
    }, [token, props, spotyClicked])

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
                    saveDevice(option.id, option.name);
                }
            }
        })
    }

    return (
        <div className='dropdown'>
            <div>
                <label htmlFor="options" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {props.data == 'topSongs' ? 'Select first song for the playlist'
                        : (
                            <>
                                {deviceName ? (<><p>Device selected:</p><p style={{ color: '#73BBC9' }}>{deviceName}</p></>) : <p>Select device</p>}
                            </>
                        )}
                </label>
                {!isLoading ? (
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
                ) : (
                    <ColorRing
                        visible={true}
                        height="50"
                        width="50"
                        ariaLabel="blocks-loading"
                        wrapperStyle={{}}
                        wrapperClass="blocks-wrapper"
                        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                    />
                )}
            </div>
            {props.data === 'devices' ? (
                <SpotyButton setSpotyClicked={setSpotyClicked}></SpotyButton>
            ) : <></>}
        </div>
    )
}

export default DropDown