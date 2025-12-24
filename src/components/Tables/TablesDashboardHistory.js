import {
  Badge,
  Flex,
  Td,
  Text,
  Tr,
  useColorModeValue,
  Tbody,
  Thead,
  Th,
  Box,
  Spinner,
} from "@chakra-ui/react";
import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import moment from "moment";
import { API_URL } from "constant/data";

function TablesDashboardHistory() {
  const textColor = useColorModeValue("gray.700", "white");

  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 40 seconds
    const interval = setInterval(fetchData, 40000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/historys/token`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Sort by date descending (newest first) and limit to 5
      const sortedData = response.data
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
      setHistoryData(sortedData);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" h="150px">
        <Spinner size="md" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box maxH="250px" overflowY="auto">
      <Thead position="sticky" top="0" bg="gray.50" zIndex="1">
        <Tr>
          <Th>Tanggal</Th>
          <Th>Deskripsi</Th>
          <Th>Waktu</Th>
          <Th>Status</Th>
        </Tr>
      </Thead>
      <Tbody>
        {historyData.length === 0 ? (
          <Tr>
            <Td colSpan="4">
              <Text textAlign="center" color="gray.500">Tidak ada data</Text>
            </Td>
          </Tr>
        ) : (
          historyData.map((history) => (
            <Tr key={history.id}>
              <Td>
                <Text fontSize="sm" color={textColor} fontWeight="bold">
                  {moment(history.date).format("DD MMM YYYY")}
                </Text>
              </Td>
              <Td maxW="200px">
                <Text fontSize="sm" color={textColor} noOfLines={1}>
                  {history.description || "-"}
                </Text>
              </Td>
              <Td>
                <Text fontSize="sm" color={textColor}>
                  {moment(history.date).format("HH:mm")}
                </Text>
              </Td>
              <Td>
                <Badge
                  colorScheme={history.status === 1 ? "orange" : "green"}
                  fontSize="xs"
                  px="2"
                  py="1"
                  borderRadius="full"
                >
                  {history.status === 1 ? "Pending" : "Resolved"}
                </Badge>
              </Td>
            </Tr>
          ))
        )}
      </Tbody>
    </Box>
  );
}

export default TablesDashboardHistory;
