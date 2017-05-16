import React from 'react';
import Header from './src/components/Header.jsx'
import Calendar from './src/components/calendar/Calendar.jsx'
import Footer from './src/components/Footer.jsx'

class App extends React.Component {
    render() {
        return (
            <div>
                <Header />
                <Calendar />
                <Footer />
            </div>
        );
    }
}

export default App;
