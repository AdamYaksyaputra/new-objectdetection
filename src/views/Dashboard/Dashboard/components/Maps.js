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
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "constant/data";

export default function Maps() {
    const textColor = useColorModeValue("gray.700", "white");
    const [sensors, setSensors] = useState([]);
    const [pendingHistories, setPendingHistories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
        // Auto-refresh every 40 seconds
        const interval = setInterval(fetchData, 40000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            // Fetch sensors
            const sensorRes = await axios.get(`${API_URL}/api/sensor`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSensors(sensorRes.data);

            // Fetch histories to check which sensors have pending alerts (status = 1)
            const historyRes = await axios.get(`${API_URL}/api/historys/token`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            // Filter pending histories (status = 1)
            const pending = historyRes.data.filter(h => h.status === 1);
            setPendingHistories(pending);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching map data:', error);
            setLoading(false);
        }
    };

    // Check if sensor has pending alert
    const hasPendingAlert = (sensorId) => {
        return pendingHistories.some(h => h.sensor_id === sensorId);
    };

    return (
        <Card overflowX={{ sm: "scroll", xl: "hidden" }} boxShadow="md">
            <CardHeader p='6px 0px 22px 0px'>
                <Text fontSize='xl' color={textColor} fontWeight='bold'>
                    Location & Sensor Status
                </Text>
            </CardHeader>
            <CardBody>
                <Flex direction="row" gap="6" h="550px">
                    {/* Map - 50% width */}
                    <Box w="50%" h="100%" borderRadius="lg" overflow="hidden" border="1px solid" borderColor="gray.200">
                        <iframe
                            title="Location Map"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            marginHeight="0"
                            marginWidth="0"
                            src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Jl.%20Araya%20Mansion%20No.8%20-%2022,%20Genitri,%20Tirtomoyo,%20Kec.%20Pakis,%20Kabupaten%20Malang,%20Jawa%20Timur%2065154+(BINUS%20University%20Malang)&amp;t=&amp;z=18&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                        />
                    </Box>

                    {/* Sensor Status Table - 50% width */}
                    <Box w="50%" h="100%" display="flex" flexDirection="column">
                        <Text fontSize='lg' fontWeight='bold' color={textColor} mb="4">
                            Status Sensor
                        </Text>

                        {loading ? (
                            <Flex justify="center" align="center" flex="1">
                                <Spinner size="lg" color="blue.500" />
                            </Flex>
                        ) : (
                            <Box flex="1" overflowY="auto" border="1px solid" borderColor="gray.200" borderRadius="lg">
                                <Table variant="simple" size="md">
                                    <Thead bg="gray.50" position="sticky" top="0" zIndex="1">
                                        <Tr>
                                            <Th fontSize="sm">Sensor</Th>
                                            <Th fontSize="sm">Status</Th>
                                            <Th fontSize="sm">Koordinat</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {sensors.map((sensor) => {
                                            const isPending = hasPendingAlert(sensor.id);
                                            return (
                                                <Tr key={sensor.id} bg={isPending ? "red.50" : "white"}>
                                                    <Td>
                                                        <Text fontWeight="bold" fontSize="md">{sensor.code}</Text>
                                                    </Td>
                                                    <Td>
                                                        <Badge
                                                            colorScheme={isPending ? "red" : "green"}
                                                            fontSize="sm"
                                                            px="3"
                                                            py="1"
                                                            borderRadius="full"
                                                        >
                                                            {isPending ? "⚠️ TRIGGERED" : "✓ Normal"}
                                                        </Badge>
                                                    </Td>
                                                    <Td>
                                                        <Text fontSize="sm" color="gray.500">
                                                            {sensor.latitude?.toFixed(4)}, {sensor.longitude?.toFixed(4)}
                                                        </Text>
                                                    </Td>
                                                </Tr>
                                            );
                                        })}
                                    </Tbody>
                                </Table>
                            </Box>
                        )}

                        {/* Legend */}
                        <Flex gap="6" mt="4" p="3" bg="gray.50" borderRadius="md" justify="center">
                            <Flex align="center" gap="2">
                                <Box w="14px" h="14px" borderRadius="50%" bg="green.500" />
                                <Text fontSize="sm" color="gray.600">Normal</Text>
                            </Flex>
                            <Flex align="center" gap="2">
                                <Box w="14px" h="14px" borderRadius="50%" bg="red.500" />
                                <Text fontSize="sm" color="gray.600">Triggered</Text>
                            </Flex>
                        </Flex>
                    </Box>
                </Flex>
            </CardBody>
        </Card>
    );
};
