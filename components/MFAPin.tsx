import React, { useState, useRef } from 'react';

interface MFAPinProps {
  onPinSuccess: () => void;
}

const MFAPin: React.FC<MFAPinProps> = ({ onPinSuccess }) => {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === '') {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      if (value !== '' && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && pin[index] === '' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredPin = pin.join('');
    if (enteredPin.length === 6) {
      onPinSuccess();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-sm p-8 space-y-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        <div className="text-center">
            <img src="https://kite.zerodha.com/static/images/kite-logo.svg" alt="Kite Logo" className="w-10 h-10 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Enter PIN</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Enter your 6-digit App PIN to continue</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-2">
            {pin.map((digit, index) => (
              <input
                key={index}
                // Fix: A ref callback should not return a value. Using a block body ensures an implicit void return.
                ref={(el) => { inputsRef.current[index] = el; }}
                type="password"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 text-center text-2xl font-semibold border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            ))}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Continue
            </button>
          </div>
        </form>
         <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Forgot PIN?</a>
        </p>
      </div>
    </div>
  );
};

export default MFAPin;
