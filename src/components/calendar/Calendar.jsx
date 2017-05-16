import React from 'react';
import CalendarDetail from './Calendar-detail.jsx';
// import Style from './calendar.scss';
require('./calendar.scss');

class Calendar extends React.Component {
    // let tableBorder = {}
    render() {
        return (
            <div>
                <h1>Hello this is calendar</h1>
                <table className='calendar-table'>
                    <thead>
                    <tr>
                        <th>周日</th>
                        <th>周一</th>
                        <th>周二</th>
                        <th>周三</th>
                        <th>周四</th>
                        <th>周五</th>
                        <th>周六</th>
                    </tr>
                    </thead>
                    <CalendarDetail />
                </table>
            </div>
        );
    }
}

export default Calendar;
