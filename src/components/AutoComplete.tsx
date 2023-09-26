import React, { useEffect, useState, KeyboardEvent, useRef, ChangeEvent } from 'react';
import loader from '../assets/loader.svg';
import './AutoComplete.css'


export interface IAutoCompleteOption<T> {
    label: string;
    id?: number;
    value?: T;
}

interface IAutoComplete<T> {
    options: IAutoCompleteOption<T>[];
    classContainer?: string;
    classInput?: string;
    classOptionsContainer?: string;
    classOption?: string;
    placeholder?: string;
    noOptionsFound?: string;
    disabled?: boolean;
    onFocus?(): void;
    onBlur?(): void;
    onSelected?(option: IAutoCompleteOption<T>): void;
}

export const AutoComplete = <T,>({
    options,
    classContainer = '',
    classInput = '',
    classOptionsContainer = '',
    classOption = '',
    placeholder = '',
    noOptionsFound = 'No options',
    disabled = false,
    onFocus,
    onBlur,
    onSelected
}: IAutoComplete<T>) => {
    const [focused, setFocused] = useState<boolean>(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [selectedLabel, setSelectedLabel] = useState<string>('');
    const [internalOptions, setInternalOptions] = useState<IAutoCompleteOption<T>[]>(options);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const optionsContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setSelectedIndex(null);
        //if there's only one, then automatically selected:
        if(internalOptions.length === 1){
            setSelectedIndex(0)
        }
    }, [internalOptions])

    const handleFocus = () => {
        if (onFocus) {
            onFocus();
        }
        setFocused(true);

        filter(selectedLabel).then((filteredOptions) => {
            setInternalOptions(filteredOptions);
        }).finally(() => {
            setIsLoading(false);
        });
    };

    const handleBlur = () => {
        if (onBlur) {
            onBlur();
        }
        setFocused(false)
        setSelectedIndex(null);
    }

    const handleSelected = (option: IAutoCompleteOption<T>) => {
        if (onSelected) {
            onSelected(option);
        }
        setSelectedLabel(option.label)
        inputRef.current?.blur();
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        const offset = 100;

        if (focused && internalOptions.length > 0) {
            switch (e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    if (selectedIndex !== null && optionsContainerRef.current) {
                        const selectedOption = optionsContainerRef.current.childNodes[selectedIndex] as HTMLElement;

                        if (selectedOption) {
                            optionsContainerRef.current.scrollTop = selectedOption.offsetTop - offset
                        }
                    }
                    setSelectedIndex((prevIndex) => (prevIndex !== null ? Math.max(prevIndex - 1, 0) : internalOptions.length - 1));
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    if (selectedIndex !== null && optionsContainerRef.current) {
                        const selectedOption = optionsContainerRef.current.childNodes[selectedIndex] as HTMLElement;

                        if (selectedOption) {
                            optionsContainerRef.current.scrollTop = selectedOption.offsetTop + selectedOption.offsetHeight - optionsContainerRef.current.clientHeight + offset;
                        }
                    }
                    setSelectedIndex((prevIndex) => (prevIndex !== null ? Math.min(prevIndex + 1, internalOptions.length - 1) : 0));
                    break;
                case 'Enter':
                    if (selectedIndex !== null) {
                        handleSelected(internalOptions[selectedIndex]);
                    }
                    break;
                default:
                    break;
            }
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSelectedLabel(value);
        setIsLoading(true);

        filter(value).then((filteredOptions) => {
            setInternalOptions(filteredOptions);
        }).finally(() => {
            setIsLoading(false);
        });
    }

    const filter = (value: string): Promise<IAutoCompleteOption<T>[]> => {
        return new Promise((resolve) => {
            if (value.trim() === '') {
                resolve(options);
            } else {
                const filteredOptions = options.filter((option) => {
                    if (option.label.includes(value)) return option;
                })
                resolve(filteredOptions);
            }
        });
    };

    const highlightLabel = (label: string): React.ReactNode => {
        //hightlight only if more than 1 options:
        if(internalOptions.length === 1) return label;

        //search in the label all the matching string of the user input (case unsensitive) and separate all the matching substrings
        const parts = label.split(new RegExp(`(${selectedLabel})`, 'gi'));
        return parts.map((part, index) => (
            part.toLowerCase() === selectedLabel.toLowerCase() ? (
                <mark key={index}>{part}</mark>
            ) : (
                part
            )
        ));
    };

    return (
        <span className={`wrapper-autocomplete ${classContainer}`}>
            <input
                type="text"
                className={`input-autocomplete ${classInput}`}
                placeholder={placeholder}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onChange={handleChange}
                value={selectedLabel}
                ref={inputRef}
                disabled={disabled}
            />

            <div
                className={`options-container ${focused ? 'show' : ''} ${classOptionsContainer}`}
                ref={optionsContainerRef}
            >
                {internalOptions.length > 0 ?
                    internalOptions.map((option, index) =>
                        <span
                            className={`option ${classOption} ${index === selectedIndex ? 'selected' : ''}`}
                            onMouseDown={() => handleSelected(option)}
                            onMouseMove={() => setSelectedIndex(index)}
                            key={`options-${option.id ?? '_'}_${index}`}
                        >
                            { highlightLabel(option.label) }
                        </span>
                    )
                    :
                    <span className='option'>
                        { noOptionsFound }
                    </span>
                }

                <span className={`options-loader-backdrop ${isLoading ? 'show' : ''}`} />
                <img className={`options-loader ${isLoading ? 'show' : ''}`} src={loader} alt="loader" />
            </div>
        </span>
    )
}