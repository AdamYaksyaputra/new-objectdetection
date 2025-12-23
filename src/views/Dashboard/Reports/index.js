import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Flex,
    Text,
    Button,
    Select,
    Input,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    useColorModeValue,
    Spinner,
    useToast,
    ButtonGroup,
    IconButton,
} from "@chakra-ui/react";
import { DownloadIcon, EmailIcon } from "@chakra-ui/icons";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import { API_URL } from "constant/data";

function Reports() {
    // State
    const [reportType, setReportType] = useState("weekly");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("");
    const [branches, setBranches] = useState([]);
    const [summary, setSummary] = useState(null);
    const [preview, setPreview] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sendingEmail, setSendingEmail] = useState(false);

    // Theme colors
    const textColor = useColorModeValue("gray.700", "white");
    const cardBg = useColorModeValue("white", "gray.700");
    const binusBlue = "#1E4DB7";
    const alertRed = "#E53E3E";
    const successGreen = "#38A169";

    const toast = useToast();

    // Get auth token
    const getToken = () => localStorage.getItem("token");

    // Fetch branches for filter
    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/reports/branches`, {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                setBranches(response.data);
            } catch (error) {
                console.error("Error fetching branches:", error);
            }
        };
        fetchBranches();
    }, []);

    // Fetch report data when filters change
    useEffect(() => {
        fetchReportData();
    }, [reportType, selectedDate, selectedBranch]);

    const fetchReportData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append("type", reportType);
            if (selectedDate) params.append("date", selectedDate);
            if (selectedBranch) params.append("branch_id", selectedBranch);

            const [summaryRes, previewRes] = await Promise.all([
                axios.get(`${API_URL}/api/reports/summary?${params}`, {
                    headers: { Authorization: `Bearer ${getToken()}` },
                }),
                axios.get(`${API_URL}/api/reports/preview?${params}`, {
                    headers: { Authorization: `Bearer ${getToken()}` },
                }),
            ]);

            setSummary(summaryRes.data);
            setPreview(previewRes.data);
        } catch (error) {
            console.error("Error fetching report data:", error);
            toast({
                title: "Error",
                description: "Failed to fetch report data",
                status: "error",
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    // Download Excel
    const handleDownload = async () => {
        try {
            const params = new URLSearchParams();
            params.append("type", reportType);
            if (selectedDate) params.append("date", selectedDate);
            if (selectedBranch) params.append("branch_id", selectedBranch);

            const response = await axios.get(
                `${API_URL}/api/reports/download?${params}`,
                {
                    headers: { Authorization: `Bearer ${getToken()}` },
                    responseType: "blob",
                }
            );

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `security_report_${reportType}_${new Date().toISOString().split("T")[0]}.xlsx`
            );
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast({
                title: "Success",
                description: "Report downloaded successfully",
                status: "success",
                duration: 3000,
            });
        } catch (error) {
            console.error("Error downloading report:", error);
            toast({
                title: "Error",
                description: "Failed to download report",
                status: "error",
                duration: 3000,
            });
        }
    };

    // Send Email
    const handleSendEmail = async () => {
        setSendingEmail(true);
        try {
            const params = new URLSearchParams();
            params.append("type", reportType);
            if (selectedDate) params.append("date", selectedDate);
            if (selectedBranch) params.append("branch_id", selectedBranch);

            await axios.post(
                `${API_URL}/api/reports/send-email?${params}`,
                {},
                {
                    headers: { Authorization: `Bearer ${getToken()}` },
                }
            );

            toast({
                title: "Email Sent!",
                description: "Report has been sent to all recipients",
                status: "success",
                duration: 5000,
            });
        } catch (error) {
            console.error("Error sending email:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to send email",
                status: "error",
                duration: 5000,
            });
        } finally {
            setSendingEmail(false);
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
            {/* Filter Area */}
            <Card mb="20px" bg={cardBg}>
                <CardHeader>
                    <Text fontSize="xl" fontWeight="bold" color={textColor}>
                        Security Reports
                    </Text>
                </CardHeader>
                <CardBody>
                    <Flex
                        direction={{ base: "column", md: "row" }}
                        gap="4"
                        alignItems="flex-end"
                    >
                        {/* Report Type Toggle */}
                        <Box>
                            <Text fontSize="sm" fontWeight="bold" mb="2" color={textColor}>
                                Report Type
                            </Text>
                            <ButtonGroup size="sm" isAttached variant="outline">
                                {["daily", "weekly", "monthly"].map((type) => (
                                    <Button
                                        key={type}
                                        onClick={() => setReportType(type)}
                                        bg={reportType === type ? binusBlue : "transparent"}
                                        color={reportType === type ? "white" : textColor}
                                        _hover={{
                                            bg: reportType === type ? binusBlue : "gray.100",
                                        }}
                                    >
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </Button>
                                ))}
                            </ButtonGroup>
                        </Box>

                        {/* Date Picker */}
                        <Box>
                            <Text fontSize="sm" fontWeight="bold" mb="2" color={textColor}>
                                {reportType === "daily"
                                    ? "Date"
                                    : reportType === "weekly"
                                        ? "Week"
                                        : "Month"}
                            </Text>
                            <Input
                                type={reportType === "monthly" ? "month" : "date"}
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                size="sm"
                                width="200px"
                            />
                        </Box>

                        {/* Branch Filter */}
                        <Box>
                            <Text fontSize="sm" fontWeight="bold" mb="2" color={textColor}>
                                Branch
                            </Text>
                            <Select
                                size="sm"
                                width="200px"
                                value={selectedBranch}
                                onChange={(e) => setSelectedBranch(e.target.value)}
                                placeholder="All Branches"
                            >
                                {branches.map((branch) => (
                                    <option key={branch.id} value={branch.id}>
                                        {branch.name} - {branch.city}
                                    </option>
                                ))}
                            </Select>
                        </Box>
                    </Flex>
                </CardBody>
            </Card>

            {loading ? (
                <Flex justify="center" align="center" minH="200px">
                    <Spinner size="xl" color={binusBlue} />
                </Flex>
            ) : (
                <>
                    {/* Executive Summary Cards */}
                    {summary && (
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing="20px" mb="20px">
                            <Card bg={cardBg}>
                                <CardBody>
                                    <Stat>
                                        <StatLabel color={textColor}>Total Detections</StatLabel>
                                        <StatNumber color={binusBlue} fontSize="3xl">
                                            {summary.totalDetections}
                                        </StatNumber>
                                        <StatHelpText>
                                            {formatDate(summary.period.startDate)} -{" "}
                                            {formatDate(summary.period.endDate)}
                                        </StatHelpText>
                                    </Stat>
                                </CardBody>
                            </Card>

                            <Card bg={cardBg}>
                                <CardBody>
                                    <Stat>
                                        <StatLabel color={textColor}>Emergency Events</StatLabel>
                                        <StatNumber
                                            color={summary.emergencyEvents > 0 ? alertRed : textColor}
                                            fontSize="3xl"
                                        >
                                            {summary.emergencyEvents}
                                        </StatNumber>
                                        <StatHelpText>
                                            {summary.emergencyEvents > 0 ? "⚠️ Needs attention" : "✅ All clear"}
                                        </StatHelpText>
                                    </Stat>
                                </CardBody>
                            </Card>

                            <Card bg={cardBg}>
                                <CardBody>
                                    <Stat>
                                        <StatLabel color={textColor}>Avg Response Time</StatLabel>
                                        <StatNumber
                                            color={summary.avgResponseTime < 5 ? successGreen : alertRed}
                                            fontSize="3xl"
                                        >
                                            {summary.avgResponseTime} min
                                        </StatNumber>
                                        <StatHelpText>
                                            {summary.avgResponseTime < 5 ? "🚀 Fast" : "⏱️ Slow"}
                                        </StatHelpText>
                                    </Stat>
                                </CardBody>
                            </Card>

                            <Card bg={cardBg}>
                                <CardBody>
                                    <Stat>
                                        <StatLabel color={textColor}>System Uptime</StatLabel>
                                        <StatNumber
                                            color={summary.systemUptime >= 90 ? successGreen : alertRed}
                                            fontSize="3xl"
                                        >
                                            {summary.systemUptime}%
                                        </StatNumber>
                                        <StatHelpText>
                                            {summary.activeSensors}/{summary.totalSensors} sensors active
                                        </StatHelpText>
                                    </Stat>
                                </CardBody>
                            </Card>
                        </SimpleGrid>
                    )}

                    {/* Report Preview Table */}
                    <Card bg={cardBg} mb="20px">
                        <CardHeader>
                            <Flex justify="space-between" align="center" width="100%">
                                <Text fontSize="lg" fontWeight="bold" color={textColor}>
                                    Report Preview
                                </Text>
                                <Flex gap="2">
                                    <Button
                                        leftIcon={<DownloadIcon />}
                                        bg={binusBlue}
                                        color="white"
                                        size="sm"
                                        onClick={handleDownload}
                                        _hover={{ bg: "#163a8a" }}
                                    >
                                        Download Excel
                                    </Button>
                                    <Button
                                        leftIcon={<EmailIcon />}
                                        bg={binusBlue}
                                        color="white"
                                        size="sm"
                                        onClick={handleSendEmail}
                                        isLoading={sendingEmail}
                                        _hover={{ bg: "#163a8a" }}
                                    >
                                        Send Email Now
                                    </Button>
                                </Flex>
                            </Flex>
                        </CardHeader>
                        <CardBody overflowX="auto">
                            <Table variant="simple" size="sm">
                                <Thead>
                                    <Tr>
                                        <Th>Date</Th>
                                        <Th>Time</Th>
                                        <Th>Branch</Th>
                                        <Th>Sensor</Th>
                                        <Th>Security</Th>
                                        <Th>Status</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {preview.length === 0 ? (
                                        <Tr>
                                            <Td colSpan={6} textAlign="center" py="8">
                                                <Text color="gray.500">No data available for selected period</Text>
                                            </Td>
                                        </Tr>
                                    ) : (
                                        preview.map((item, index) => (
                                            <Tr
                                                key={item.id || index}
                                                bg={item.isEmergency ? "red.50" : "transparent"}
                                            >
                                                <Td>{formatDate(item.date)}</Td>
                                                <Td>{formatTime(item.date)}</Td>
                                                <Td>{item.branch}</Td>
                                                <Td>{item.sensorCode}</Td>
                                                <Td>{item.security}</Td>
                                                <Td>
                                                    <Badge
                                                        colorScheme={item.isEmergency ? "red" : "green"}
                                                    >
                                                        {item.isEmergency ? "Emergency" : "Normal"}
                                                    </Badge>
                                                </Td>
                                            </Tr>
                                        ))
                                    )}
                                </Tbody>
                            </Table>
                            {preview.length > 0 && (
                                <Text fontSize="sm" color="gray.500" mt="4" textAlign="center">
                                    Showing {preview.length} most recent records. Download Excel for full data.
                                </Text>
                            )}
                        </CardBody>
                    </Card>
                </>
            )}
        </Flex>
    );
}

export default Reports;
