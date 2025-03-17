'use client';

import { useState } from 'react';
import { Field, Label, Switch } from '@headlessui/react';

interface ToggleProps {
    onChange?: (value: boolean) => void;
}

function Toggle(props: ToggleProps) {
    const [enabled, setEnabled] = useState(false);

    const onChange = (value: boolean) => {
        setEnabled(value);
        if (props.onChange) {
            props.onChange(value);
        }
    }

    return (
        <Field className="flex items-center gap-2">
            <Switch
                checked={enabled}
                onChange={onChange}
                className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-neutral-200 dark:bg-neutral-700 transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:outline-hidden data-checked:bg-indigo-600"
            >
                <span
                    aria-hidden="true"
                    className="pointer-events-none inline-block size-5 transform rounded-full bg-white ring-0 shadow-sm transition duration-200 ease-in-out group-data-checked:translate-x-5"
                />
            </Switch>
            <Label as="span" className="text-sm">
                <span className="font-medium text-neutral-900 dark:text-neutral-100">Hide complete</span>{' '}
            </Label>
        </Field>
    );
}

export default Toggle;
