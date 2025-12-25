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
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { API_URL } from "constant/data";

function TablesTableRow() {
  const textColor = useColorModeValue("gray.700", "white");
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 40 seconds
    const interval = setInterval(fetchData, 40000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/accounts/token`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Limit to 5 accounts
      const limitedData = response.data.slice(0, 5);
      setUserData(limitedData);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // Loading skeleton rows
  const SkeletonRows = () => (
    <>
      {[1, 2, 3].map((i) => (
        <Tr key={i}>
          <Td><Skeleton height="16px" width="100px" /></Td>
          <Td><Skeleton height="16px" width="150px" /></Td>
          <Td><Skeleton height="20px" width="60px" borderRadius="full" /></Td>
        </Tr>
      ))}
    </>
  );

  return (
    <Box maxH="250px" overflowY="auto">
      <Thead position="sticky" top="0" bg="gray.50" zIndex="1">
        <Tr>
          <Th>Nama</Th>
          <Th>Email</Th>
          <Th>Role</Th>
        </Tr>
      </Thead>
      <Tbody>
        {loading ? (
          <SkeletonRows />
        ) : userData.length === 0 ? (
          <Tr>
            <Td colSpan="3">
              <Text textAlign="center" color="gray.500">Tidak ada data</Text>
            </Td>
          </Tr>
        ) : (
          userData.map((user) => (
            <Tr key={user.id}>
              <Td>
                <Text fontSize="sm" color={textColor} fontWeight="bold">
                  {user.name}
                </Text>
              </Td>
              <Td>
                <Text fontSize="sm" color={textColor}>
                  {user.email}
                </Text>
              </Td>
              <Td>
                <Badge
                  bg={user.role === 'admin' ? 'purple.500' : 'green.400'}
                  color="white"
                  fontSize="xs"
                  px="2"
                  py="1"
                  borderRadius="full"
                >
                  {user.role}
                </Badge>
              </Td>
            </Tr>
          ))
        )}
      </Tbody>
    </Box>
  );
}

export default TablesTableRow;
