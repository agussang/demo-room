import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './components/Dashboard';
import MICEmanagement from './components/MICEmanagement';
// Simple routing based on pathname
const renderComponent = () => {
    const path = window.location.pathname;
    if (path === '/ruang-meeting/' || path === '/ruang-meeting/index.html' || path.includes('/ruang-meeting')) {
        return _jsx(MICEmanagement, {});
    }
    else {
        return _jsx(Dashboard, {});
    }
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(_jsx(React.StrictMode, { children: renderComponent() }));
