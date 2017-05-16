import React from 'react';

class CalendarDetail extends React.Component {
    render() {
        let cell1 = <td>1</td>;
        let cell2 = <td>2</td>;
        let rows = getRows(getRightNow());
        return (
            <tbody>
                {rows}
            </tbody>
        );
    }
}

export default CalendarDetail;
// Phase one: traditional calendar only
//          By month
//          By week
//          By day

// Get a date object to represent right now
let getRightNow = () => {
    return new Date();
};

// Get which day is the given date (Sunday is 0)
let getDay = (date) => {
    let day = date.getDay();
    return day === 7 ? 0 : day;
};


// Get the total number of days of the given date
let getDays = (date) => {
    //月份(1 ~ 12)，提取出月，日，计算出days值后，再改回去
    let month = date.getMonth() + 1;
    let currentDate = date.getDate();

    date.setMonth(month, 0);
    let days = date.getDate();

    date.setMonth(month - 1, currentDate);

    return days;
}

// Get first day of the given date's month
let getFirstDayOfMonth = (date) => {
    let currentDate = date.getDate();
    //修改日期，求出1号周几
    date.setDate(1);
    let firstDayOfMonth = getDay(date);
    //日期复位
    date.setDate(currentDate);
    //返回
    return firstDayOfMonth;
}

// Get last day of the given date's month
let getLastDayOfMonth = (date) => {
    let currentDate = date.getDate();
    let days = getDays(date);
    //将日期设置为最后一天，以便计算某个月份的最后一天是周几
    date.setDate(days);
    //求出最后一天周几，调用自定义方法getDay()，传入日期参数
    let lastDayOfMonth = getDay(date);
    //再将日期复位为传入时的日期
    date.setDate(currentDate);

    return lastDayOfMonth;
}

let getRows = (customDate) => {
    //今天几号
    let date = customDate.getDate();
    //本月一共多少天
    let days = getDays(customDate);

    //1号星期几
    let firstDayOfMonth = getFirstDayOfMonth(customDate);

    let dateString = "";
    let rows = [];
    let cellsPerRow = [];
    let counter = 1;
    for (let i = 0; i < firstDayOfMonth; i++) {
        cellsPerRow.push(<td key={i}></td>);
    }
    for (let i = 1; i <= days; i++) {
        if(i === date){
            cellsPerRow.push(<td className='today' key={i} onClick={(event, i) => {dayClickHandler(event, i)}}>{i}</td>);
        }
        else{
            cellsPerRow.push(<td className='current' key={i} onClick={(event, i) => {dayClickHandler(event, i)}}>{i}</td>);
        }
        //到达周末后，换一行显示
        if ((i + firstDayOfMonth) % 7 === 0) {
            rows.push(<tr key={counter++}>{cellsPerRow}</tr>);
            //清空，以接收下一行
            cellsPerRow = [];
        }
    }
    if (cellsPerRow.length) {
        rows.push(<tr key={counter}>{cellsPerRow}</tr>);
    }

    return rows;
}

let dayClickHandler = (event, id) => {
    alert('day: ' + id + ' clicked');
}

// Phase two: smart calendar (after event indexing)
//          Search engine for date facet (range)
//          Search engine for event category facet (event specific)
//          Search engine for people facet (user/group specific)
//          Search engine for keyword specific (query search)
