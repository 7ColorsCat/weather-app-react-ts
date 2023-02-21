import React from 'react';
import { BsPinMapFill, BsSearch } from 'react-icons/bs';

interface Props {
    handleSubmit: React.FormEventHandler<HTMLFormElement>;
    handleOnChange: React.ChangeEventHandler<HTMLInputElement>;
}
export const SearchForm: React.FC<Props> = ({
    handleSubmit,
    handleOnChange,
}) => {
    return (
        <form className="flex gap-1 items-center" onSubmit={handleSubmit}>
            <BsPinMapFill />
            <input
                type="text"
                className="flex-1 outline-none text-md uppercase px-1 py-2 rounded placeholder:capitalize"
                placeholder="Enter your location"
                onChange={handleOnChange}
            />
            <button className="p-2 rounded-full bg-sky-300" type="submit">
                <BsSearch />
            </button>
        </form>
    );
};
