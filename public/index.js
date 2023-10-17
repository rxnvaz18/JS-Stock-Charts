// The easiest part to start with was making a function with if statements to assign a rgba  or color value/code to the data points for each stock.
// rgba stands for red, green, blue, and alpha for opacity
function getColor(stock) {
    if(stock === 'GME'){
        return 'rgba(0, 89, 198, 0.9)'
    }
    if(stock === 'MSFT'){
        return 'rgba(142, 148, 242, 0.9)'
    }
    if(stock === 'DIS'){
        return 'rgba(81, 212, 155, 0.9)'
    }
    if(stock === 'BNTX'){
        return 'rgba(218, 182, 252, 0.9)'
    }
}
// asynchronous function that runs code and then fetches info from twelvedata and runs it through json application
async function main() {
    
// chose const instead of my usual 'let' for assigning variables because I wanted to give the variables more weight into being constant since we are dealing with quantitative data
    const timeChartCanvas = document.querySelector('#time-chart');// selects appropriate id from the html to refer to the overall layout of the page and where the charts are in relation to eachother
    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
    const averagePriceChartCanvas = document.querySelector('#average-price-chart');

    const response = await fetch('https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=1day&apikey=1b9d97c7e6ab4207b0a65f3915b944c3')
// added my sepcific api key at the end of the link
    const result = await response.json()
// declares stock variable names that will return the values store in mockData.js
    const { GME, MSFT, DIS, BNTX } = result

    const stocks = [GME, MSFT, DIS, BNTX]
// declares variable that refers to all stock data
    stocks.forEach(stock => stock.values.reverse())
// makes data  on the x axis, dates, re-ordered in ascending order vs descending order
    // START OF TIME CHART
    
    new Chart(timeChartCanvas.getContext('2d'), {
        type: 'line',// type refers to type of chart which will plot data in a line graph
        data: {
            labels: stocks[0].values.map(value => value.datetime),// arrow functions for displaying data on the chart
            datasets: stocks.map(stock => ({
                label: stock.meta.symbol,
                backgroundColor: getColor(stock.meta.symbol),// backgroundColor and borderColor properties are given the getColor function as the value so that it retrieves the stock symbol created earlier with the color codes
                borderColor: getColor(stock.meta.symbol),
                data: stock.values.map(value => parseFloat(value.high))
        }))
    }
    })
// START OF HIGH CHART
// repeat of code for time chart but adjusting for bar graph type and visualizing highest prices of overall of each stock. 
new Chart(highestPriceChartCanvas.getContext('2d'), {
    type: 'bar',
    data: {
        labels: stocks.map(stock => stock.meta.symbol),
        datasets: [{
            label: 'Highest',
            backgroundColor: stocks.map(stock => (
                getColor(stock.meta.symbol)
            )),
            borderColor: stocks.map(stock => (
                getColor(stock.meta.symbol)
            )),
            data: stocks.map(stock => (
                findHighest(stock.values)
            ))
        }]
    }
})

// AVERAGE CHART
// re-modified previous code to make another chart, this time a pie chart showing average stock prices.

new Chart(averagePriceChartCanvas.getContext('2d'), {
    type: 'pie',
    data: {
        labels: stocks.map(stock => stock.meta.symbol),
        datasets: [{
            label: 'Average',
            backgroundColor: stocks.map(stock => (
                getColor(stock.meta.symbol)
            )),
            borderColor: stocks.map(stock => (
                getColor(stock.meta.symbol)
            )),
            data: stocks.map(stock => (
                calculateAverage(stock.values)// function called after it is defined at the end of the document
            ))
        }]
    }
})

}
// defining function to find highest values in the data for the highest chart
function findHighest(values) {
    let highest = 0
    values.forEach(value => {
        if (parseFloat(value.high) > highest) {
            highest = value.high
        }
    })
return highest

}
// defining function to find average price for each stock for the average chart
function calculateAverage(values) {
    let total = 0
    values.forEach(value => {
        total += parseFloat(value.high)
    })
    return total / values.length  // divides total number of data points over the sum of values in the dataset to calculate the average

}
main()