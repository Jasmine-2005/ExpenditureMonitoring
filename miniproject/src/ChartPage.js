import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './AppRoute.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function Chart() {
    const location = useLocation();
    const data = location.state?.data || [];
    const navigate = useNavigate();

    if (data.length === 0) {
        return (
            <div className="chart-container">
                <h2>No data available to display chart.</h2>
            </div>
        );
    }

    // Group expenses by category and sum the amounts
    const groupedData = data.reduce((acc, item) => {
        if (acc[item.category]) {
            acc[item.category] += parseFloat(item.amount);
        } else {
            acc[item.category] = parseFloat(item.amount);
        }
        return acc;
    }, {});

    const chartData = {
        labels: Object.keys(groupedData),
        datasets: [
            {
                label: 'Expenses by Category',
                data: Object.values(groupedData),
                backgroundColor: [
                    '#FF6384', // Red
                    '#36A2EB', // Blue
                    '#FFCE56', // Yellow
                    '#4BC0C0', // Green
                    '#9966FF', // Purple
                    '#FF9F40'  // Orange
                ],
                hoverOffset: 4
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            }
        },
        radius: '60%'  // Outer radius (reduces chart size)
    };

    return (
        <div className="chart-container">
            <p class='delete-img-back'><span onClick={() => navigate('/expense')} class="delete-img">Back</span></p>
            <h2>Expense Overview</h2>
            <Pie data={chartData} options={options}  class="pie"/>
        </div>
    );
}

export default Chart;
