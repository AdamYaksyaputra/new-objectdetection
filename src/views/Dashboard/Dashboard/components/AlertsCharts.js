import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Box, Text, Flex, useColorModeValue } from "@chakra-ui/react";
import axios from "axios";
import { API_URL } from "constant/data";
import Card from "components/Card/Card";

// Line Chart - Alerts over last 7 days
export const AlertsLineChart = () => {
    const [chartData, setChartData] = useState([]);
    const [chartCategories, setChartCategories] = useState([]);
    const textColor = useColorModeValue("gray.700", "white");

    useEffect(() => {
        fetchAlertData();
    }, []);

    const fetchAlertData = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/historys/token`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            // Process data - count alerts per day for last 7 days
            const alerts = response.data;
            const last7Days = [];
            const alertCounts = [];

            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
                last7Days.push(dateStr);

                // Count alerts for this day
                const dayStart = new Date(date);
                dayStart.setHours(0, 0, 0, 0);
                const dayEnd = new Date(date);
                dayEnd.setHours(23, 59, 59, 999);

                const count = alerts.filter(alert => {
                    const alertDate = new Date(alert.createdAt);
                    return alertDate >= dayStart && alertDate <= dayEnd;
                }).length;

                alertCounts.push(count);
            }

            setChartCategories(last7Days);
            setChartData([{ name: "Total Alert", data: alertCounts }]);
        } catch (error) {
            console.error("Error fetching alert data:", error);
        }
    };

    const chartOptions = {
        chart: {
            toolbar: { show: false },
            zoom: { enabled: false },
        },
        tooltip: { theme: "dark" },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth", width: 3 },
        xaxis: {
            categories: chartCategories,
            labels: {
                style: { colors: "#A0AEC0", fontSize: "12px" },
            },
        },
        yaxis: {
            labels: {
                style: { colors: "#A0AEC0", fontSize: "12px" },
                formatter: (val) => Math.floor(val),
            },
            min: 0,
        },
        legend: { show: false },
        grid: { strokeDashArray: 5, borderColor: "#E2E8F0" },
        fill: {
            type: "gradient",
            gradient: {
                shade: "light",
                type: "vertical",
                shadeIntensity: 0.5,
                opacityFrom: 0.7,
                opacityTo: 0.1,
            },
        },
        colors: ["#4FD1C5"],
    };

    return (
        <Card p={4} borderRadius="lg" boxShadow="md" height="300px">
            <Text fontSize="lg" fontWeight="bold" color={textColor} mb={2}>
                Alert Trend (7 Hari Terakhir)
            </Text>
            <Box height="230px">
                {chartData.length > 0 ? (
                    <ReactApexChart
                        options={chartOptions}
                        series={chartData}
                        type="area"
                        width="100%"
                        height="100%"
                    />
                ) : (
                    <Flex justify="center" align="center" height="100%">
                        <Text color="gray.500">Loading...</Text>
                    </Flex>
                )}
            </Box>
        </Card>
    );
};

// Bar Chart - Alerts per Sensor
export const SensorAlertsBarChart = () => {
    const [chartData, setChartData] = useState([]);
    const [chartCategories, setChartCategories] = useState([]);
    const textColor = useColorModeValue("gray.700", "white");

    useEffect(() => {
        fetchSensorAlertData();
    }, []);

    const fetchSensorAlertData = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/historys/token`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            // Count alerts per sensor
            const alerts = response.data;
            const sensorCounts = {};

            alerts.forEach(alert => {
                const sensorCode = alert.sensor?.code || `Sensor ${alert.sensor_id}`;
                sensorCounts[sensorCode] = (sensorCounts[sensorCode] || 0) + 1;
            });

            // Sort by count and take top 6
            const sorted = Object.entries(sensorCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 6);

            setChartCategories(sorted.map(s => s[0]));
            setChartData([{ name: "Total Alert", data: sorted.map(s => s[1]) }]);
        } catch (error) {
            console.error("Error fetching sensor alert data:", error);
        }
    };

    const chartOptions = {
        chart: {
            toolbar: { show: false },
        },
        tooltip: { theme: "dark" },
        xaxis: {
            categories: chartCategories,
            labels: {
                style: { colors: "#A0AEC0", fontSize: "11px" },
                rotate: -45,
            },
        },
        yaxis: {
            labels: {
                style: { colors: "#A0AEC0", fontSize: "12px" },
                formatter: (val) => Math.floor(val),
            },
            min: 0,
        },
        grid: { show: false },
        dataLabels: { enabled: false },
        plotOptions: {
            bar: {
                borderRadius: 6,
                columnWidth: "50%",
                distributed: true,
            },
        },
        colors: ["#4FD1C5", "#F6AD55", "#FC8181", "#68D391", "#63B3ED", "#B794F4"],
        legend: { show: false },
    };

    return (
        <Card p={4} borderRadius="lg" boxShadow="md" height="300px">
            <Text fontSize="lg" fontWeight="bold" color={textColor} mb={2}>
                Alert per Sensor
            </Text>
            <Box height="230px">
                {chartData.length > 0 && chartCategories.length > 0 ? (
                    <ReactApexChart
                        options={chartOptions}
                        series={chartData}
                        type="bar"
                        width="100%"
                        height="100%"
                    />
                ) : (
                    <Flex justify="center" align="center" height="100%">
                        <Text color="gray.500">Loading...</Text>
                    </Flex>
                )}
            </Box>
        </Card>
    );
};

export default { AlertsLineChart, SensorAlertsBarChart };

// Pie Chart - Emergency vs Non-Emergency
export const EmergencyPieChart = () => {
    const [chartData, setChartData] = useState([0, 0]);
    const textColor = useColorModeValue("gray.700", "white");

    useEffect(() => {
        fetchEmergencyData();
    }, []);

    const fetchEmergencyData = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/historys/token`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            const alerts = response.data;
            const emergency = alerts.filter(a => a.isEmergency === true).length;
            const nonEmergency = alerts.filter(a => a.isEmergency === false || a.isEmergency === null).length;

            setChartData([emergency, nonEmergency]);
        } catch (error) {
            console.error("Error fetching emergency data:", error);
        }
    };

    const chartOptions = {
        chart: {
            type: 'donut',
        },
        labels: ['Emergency', 'Non-Emergency'],
        colors: ['#FC8181', '#68D391'],
        legend: {
            position: 'bottom',
            fontSize: '14px',
            labels: {
                colors: ['#A0AEC0', '#A0AEC0'],
            },
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return Math.round(val) + '%';
            },
            style: {
                fontSize: '14px',
                fontWeight: 'bold',
            },
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '16px',
                            fontWeight: 600,
                        },
                        value: {
                            show: true,
                            fontSize: '22px',
                            fontWeight: 700,
                        },
                        total: {
                            show: true,
                            label: 'Total Alerts',
                            fontSize: '14px',
                            formatter: function (w) {
                                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                            },
                        },
                    },
                },
            },
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 300
                },
                legend: {
                    position: 'bottom'
                }
            }
        }],
    };

    const total = chartData[0] + chartData[1];

    return (
        <Card p={4} borderRadius="lg" boxShadow="md" height="350px">
            <Text fontSize="lg" fontWeight="bold" color={textColor} mb={2}>
                Emergency vs Non-Emergency
            </Text>
            <Box height="280px">
                {total > 0 ? (
                    <ReactApexChart
                        options={chartOptions}
                        series={chartData}
                        type="donut"
                        width="100%"
                        height="100%"
                    />
                ) : (
                    <Flex justify="center" align="center" height="100%">
                        <Text color="gray.500">No data available</Text>
                    </Flex>
                )}
            </Box>
        </Card>
    );
};
