// Chakra imports
import {
    Box,
    Text,
    Flex,
    Badge,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    useColorModeValue,
    Spinner,
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "constant/data";

// Sensor Status Table Component
export default function SensorStatusTable() {
    const textColor = useColorModeValue("gray.700", "white");
    const [sensors, setSensors] = useState([]);
    const [pendingHistories, setPendingHistories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 40000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const sensorRes = await axios.get(`${API_URL}/api/sensor`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSensors(sensorRes.data);

            const historyRes = await axios.get(`${API_URL}/api/historys/token`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const pending = historyRes.data.filter(h => h.status === 1);
            setPendingHistories(pending);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching sensor data:', error);
            setLoading(false);
        }
    };

    const hasPendingAlert = (sensorId) => {
        return pendingHistories.some(h => h.sensor_id === sensorId);
    };

    return (
        <Card p={4} borderRadius="lg" boxShadow="md" height="350px">
            <Text fontSize="lg" fontWeight="bold" color={textColor} mb={3}>
                Sensor Status
            </Text>

            {loading ? (
                <Flex justify="center" align="center" height="250px">
                    <Spinner size="lg" color="blue.500" />
                </Flex>
            ) : (
                <Box height="270px" overflowY="auto" border="1px solid" borderColor="gray.200" borderRadius="lg">
                    <Table variant="simple" size="sm">
                        <Thead bg="gray.50" position="sticky" top="0" zIndex="1">
                            <Tr>
                                <Th fontSize="xs">Sensor</Th>
                                <Th fontSize="xs">Status</Th>
                                <Th fontSize="xs">Koordinat</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {sensors.map((sensor) => {
                                const isPending = hasPendingAlert(sensor.id);
                                return (
                                    <Tr key={sensor.id} bg={isPending ? "red.50" : "white"}>
                                        <Td>
                                            <Text fontWeight="bold" fontSize="sm">{sensor.code}</Text>
                                        </Td>
                                        <Td>
                                            <Badge
                                                colorScheme={isPending ? "red" : "green"}
                                                fontSize="xs"
                                                px="2"
                                                py="1"
                                                borderRadius="full"
                                            >
                                                {isPending ? "⚠️ TRIGGERED" : "✓ Normal"}
                                            </Badge>
                                        </Td>
                                        <Td>
                                            <Text fontSize="xs" color="gray.500">
                                                {parseFloat(sensor.latitude)?.toFixed(4)}, {parseFloat(sensor.longitude)?.toFixed(4)}
                                            </Text>
                                        </Td>
                                    </Tr>
                                );
                            })}
                        </Tbody>
                    </Table>
                </Box>
            )}
        </Card>
    );
}
