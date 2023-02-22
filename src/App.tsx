import React, { useEffect, useState } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { BsWater, BsWind } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchForm } from './SearchForm';
import images from './images';

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
    const [error, setError] = useState<AxiosError | any>(null);
    const [weather, setWeather] = useState<Weather | null>();
    const [location, setLocation] = useState<string>('');
    const [showBox, setShowBox] = useState<boolean>(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios
            .get(
                `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${
                    import.meta.env.VITE_API_KEY
                }`
            )
            .then((result: AxiosResponse) => setData(result.data))
            .catch((e: AxiosError) => {
                setError(e.response);
                setData(null);
            })
            .finally(() => setShowBox(true));
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
                    image = images.cloud;
                    break;
                case 'Clear':
                    image = images.clear;
                    break;
                case 'Rain':
                    image = images.rain;
                    break;
                case 'Snow':
                    image = images.snow;
                    break;
                case 'Haze':
                    image = images.mist;
                    break;
                default:
                    image = images.not_found;
            }
            temperature = data.main.temp;
            humidity = data.main.humidity;
            wind = data.wind.speed;
            description = data.weather[0].description;
            city = data.name;
        } else if (error) {
            image = images.not_found;
            city = 'Oop! Ivalid location :/';
        }
        setWeather({ image, temperature, humidity, wind, description, city });
    }, [data, error]);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocation(e.target.value);
    };

    return (
        <div className="w-screen flex justify-center items-center px-10 py-20">
            <AnimatePresence>
                <motion.div
                    className="w-80 rounded-xl h-2/3 p-5 bg-gray-100 flex flex-col opacity-0"
                    animate={{ opacity: 1 }}
                    transition={{ type: 'tween' }}
                    layout="size"
                >
                    <SearchForm
                        handleOnChange={handleOnChange}
                        handleSubmit={handleSubmit}
                    />
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: showBox ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                    >
                        <img
                            src={`${weather?.image}`}
                            className="w-1/2 mx-auto my-4 object-cover"
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
                    </motion.div>
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
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default App;
