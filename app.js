document.addEventListener("DOMContentLoaded", () => {
    const chartContext = document.getElementById('temperatureChart').getContext('2d');
    let chart;
    let data = [];

    const oneDriveCSVLink = 'https://1drv.ms/x/c/32a1dc287c4481c2/ESkGU-eWJFBIgaVNUaYroHEBUncuUcLU-wqU81YzjudFiw?e=dw9C5y';  // OneDrive shared link to CSV file

    // Fetch CSV data from OneDrive
    async function fetchCSV() {
        try {
            const response = await fetch(oneDriveCSVLink);
            const csvText = await response.text();
            data = parseCSV(csvText);  // Parse the CSV data
            renderChart();  // Render the chart
        } catch (error) {
            console.error('Error fetching the CSV file:', error);
        }
    }

    // Parse CSV data into an array of objects
    function parseCSV(csv) {
        const lines = csv.trim().split('\n');
        const headers = lines[0].split(',');
        return lines.slice(1).map(line => {
            const values = line.split(',');
            return { date: values[0], temperature: parseFloat(values[1]) };
        });
    }

    // Render the chart using Chart.js
    function renderChart() {
        const dates = data.map(entry => entry.date);
        const temperatures = data.map(entry => entry.temperature);

        if (chart) chart.destroy();  // If chart exists, destroy it before creating a new one

        chart = new Chart(chartContext, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Temperature (°C)',
                    data: temperatures,
                    borderColor: 'red',
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: { title: { display: true, text: 'Date' } },
                    y: { title: { display: true, text: 'Temperature (°C)' }, suggestedMin: 0 }
                }
            }
        });
    }

    // Handle form submission for new data
    document.getElementById('dataForm').addEventListener('submit', (event) => {
        event.preventDefault();

        // Get new data from form
        const newDate = document.getElementById('date').value;
        const newTemperature = parseFloat(document.getElementById('temperature').value);

        // Add new data to the array
        data.push({ date: newDate, temperature: newTemperature });

        // Update the chart
        renderChart();

        // Show the download button
        document.getElementById('downloadBtn').style.display = 'block';
    });

    // Download the updated CSV file
    document.getElementById('downloadBtn').addEventListener('click', () => {
        const updatedCSV = convertToCSV(data);
        downloadCSV(updatedCSV, 'updated_temperature_data.csv');
    });

    // Convert array of objects to CSV format
    function convertToCSV(data) {
        const headers = ['Date', 'Temperature'];
        const rows = data.map(entry => `${entry.date},${entry.temperature}`);
        return [headers.join(','), ...rows].join('\n');
    }

    // Trigger CSV download
    function downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }

    // Fetch CSV data when the page loads
    fetchCSV();
});
