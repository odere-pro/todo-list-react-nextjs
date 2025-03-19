'use client';

import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { useState, ChangeEvent, useEffect } from 'react';

export const CURRENCY = ['USD', 'SEK', 'EUR'];

interface CostInputProps {
    cost: number;
    inputId?: string;
    currencySet?: string[];
    currency: string;
    className?: string;
    label?: string;
    onChange?: (cost: number, currency: string) => void;
}

function CostInput({
    currency,
    currencySet = CURRENCY,
    cost,
    onChange,
    inputId = 'cost',
    className,
    label,
}: CostInputProps) {
    const [costValue, setCostValue] = useState('');
    const [currencyValue, setCurrencyValue] = useState(currency);

    useEffect(() => {
        if (!cost) {
            setCostValue('');
            return;
        }

        setCostValue(`${cost}`);
    }, [cost]);

    useEffect(() => {
        setCurrencyValue(currency);
    }, [currency]);

    const handleCostChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!/^\d+?$/.test(value) && value) {
            return;
        }
        setCostValue(e.target.value);
        if (onChange) {
            onChange(parseFloat(e.target.value), currencyValue);
        }
    };

    const handleCurrencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setCurrencyValue(e.target.value);
        if (onChange) {
            onChange(parseFloat(costValue), e.target.value);
        }
    };

    return (
        <div className={`flex flex-col ${className}`}>
            <label htmlFor={inputId} className="block text-xs/5 text-gray-500 dark:text-neutral-400">
                {label}
            </label>
            <div className="flex items-center rounded-md bg-neutral-50/75 dark:bg-neutral-950/25 pl-3 outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-500 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                <div className="shrink-0 text-base text-neutral-900 dark:text-neutral-100 select-none sm:text-sm/6">
                    $
                </div>
                <input
                    id={inputId}
                    value={costValue}
                    name="cost"
                    type="text"
                    pattern="^\d+(\.\d{1,2})?$"
                    onChange={handleCostChange}
                    aria-describedby="price-currency"
                    placeholder="0.00"
                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-neutral-900 dark:text-neutral-100 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                />
                <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                    <select
                        id="currency"
                        name="currency"
                        aria-label="Currency"
                        onChange={handleCurrencyChange}
                        value={currencyValue}
                        className="col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pr-7 pl-3 text-base text-neutral-900 dark:text-neutral-100 bg-neutral-50/75 dark:bg-neutral-950/25 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    >
                        {currencySet.map((c) => (
                            <option key={c}>{c.toLocaleUpperCase()}</option>
                        ))}
                    </select>
                    <ChevronDownIcon
                        aria-hidden="true"
                        className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                    />
                </div>
            </div>
        </div>
    );
}

export default CostInput;
