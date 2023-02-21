import React, { useEffect, useState } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { BsPinMapFill, BsSearch, BsWater, BsWind } from 'react-icons/bs';

type Weather = {
    image: string;
    temperature: number;
    description: string;
    humidity: number;
    wind: number;
    city: string;
};

const App: React.FC = () => {
    const [data, setData] = useState<AxiosResponse | any>(null);
    const [weather, setWeather] = useState<Weather | null>();
    const [location, setLocation] = useState<string>('SaiGon');
    const [error, setError] = useState<AxiosError | any>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios
            .get(
                `https://api.openweathermap.org/data/2.5/weather?q=${location}&&units=metric&appid=${
                    import.meta.env.VITE_API_KEY
                }`
            )
            .then((result: AxiosResponse) => setData(result.data))
            .catch((e: AxiosError) => {
                setError(e.response);
            });
    };

    useEffect(() => {
        let image = '',
            temperature = 0,
            description = '',
            humidity = 0,
            wind = 0,
            city = '';
        if (data) {
            switch (data.weather[0].main) {
                case 'Clouds':
                    image = '/images/cloud.png';
                    break;
                case 'Clear':
                    image = '/images/clear.png';
                    break;
                case 'Rain':
                    image = '/images/rain.png';
                    break;
                case 'Snow':
                    image = '/images/snow.png';
                    break;
                case 'Haze':
                    image = '/images/mist.png';
                    break;
                default:
                    image = '';
            }
            temperature = data.main.temp;
            humidity = data.main.humidity;
            wind = data.wind.speed;
            description = data.weather[0].description;
            city = data.name;
        } else if (error) {
            image = '/images/404.png';
            city = 'Oop! Ivalid location :/';
        }
        setWeather({ image, temperature, humidity, wind, description, city });
    }, [data, error]);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocation(e.target.value);
    };

    return (
        <div className="w-screen flex justify-center items-center px-10 py-20">
            <div className="w-80 rounded-xl h-2/3 p-5 bg-gray-100 flex flex-col justify-evenly">
                <form
                    className="flex gap-1 items-center"
                    onSubmit={handleSubmit}
                >
                    <BsPinMapFill />
                    <input
                        type="text"
                        className="flex-1 outline-none text-md uppercase px-1 py-2 rounded placeholder:capitalize"
                        placeholder="Enter your location"
                        onChange={handleOnChange}
                    />
                    <button
                        className="p-2 rounded-full bg-sky-300"
                        type="submit"
                    >
                        <BsSearch />
                    </button>
                </form>
                <div className="text-center">
                    <img
                        src={`${weather?.image}`}
                        className="w-1/2 mx-auto my-4"
                    />
                    <p>{weather?.city}</p>
                    {data && (
                        <p className="relative text-4xl font-bold py-4">
                            {weather?.temperature}
                            <span className="absolute -top-1 text-2xl font-medium">
                                °C
                            </span>
                        </p>
                    )}
                    <p className="capitalize">{weather?.description}</p>
                </div>
                {data && (
                    <div className="flex justify-between items-center py-4">
                        <div className="flex justify-between gap-2 items-center">
                            <BsWater className="text-4xl" />
                            <div>
                                <span>{weather?.humidity}%</span>
                                <p>Humidity</p>
                            </div>
                        </div>
                        <div className="flex justify-between gap-2 items-center">
                            <BsWind className="text-4xl" />
                            <div>
                                <span>{weather?.wind}Km/h</span>
                                <p>Wind Speed</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
