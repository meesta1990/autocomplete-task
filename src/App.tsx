import React, { useState, useEffect } from 'react';
import './App.css';
import { AutoComplete, IAutoCompleteOption } from './components/AutoComplete';
import { getOptions } from './services/AppService';

function App() {
    const [mockedOptions, setMockedOptions] = useState<IAutoCompleteOption<string>[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleButtonClick = () => {
        setIsLoading(true);

        getOptions().then((response) => {
            if(response.status === 'OK' && response.result){
                setMockedOptions(response.result as unknown as IAutoCompleteOption<string>[])
            }
        }).finally(() => {
            setIsLoading(false);
        })
    };

    return (
        <div className="App">
            <header className="App-header">
                <h2>Autocomplete task</h2>
            </header>
            <div className="content">
                <button onClick={handleButtonClick} className="btn-get-options" disabled={isLoading}>
                    Get options from server
                </button>
                <AutoComplete options={mockedOptions} disabled={isLoading} />
            </div>
        </div>
    );
}

export default App;
