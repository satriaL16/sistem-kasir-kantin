import React from 'react';

export default function FlashMessage({ flash = {} }) {
    const message = flash.success || flash.error;

    if (!message) {
        return null;
    }

    const isError = Boolean(flash.error);

    return (
        <div className={`fixed right-6 top-6 z-[60] max-w-sm rounded-lg border px-4 py-3 text-sm shadow-lg ${
            isError
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-green-200 bg-green-50 text-green-700'
        }`} role="alert">
            {message}
        </div>
    );
}
