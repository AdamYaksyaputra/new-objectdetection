import {
  Avatar,
  Badge,
  Button,
  Flex,
  Td,
  Text,
  Tr,
  useColorModeValue,
  Tbody,
} from "@chakra-ui/react";
import { Card } from "antd";
import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { API_URL } from "constant/data";

function TablesTableRow(props) {
  const { name, email, role, status, } = props;
  const textColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "#1a202c");
  const colorStatus = useColorModeValue("white", "gray.400");
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/accounts/token`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const userData = response.data;
      setUserData(userData);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Tbody>
      {userData.map((user) => (
        <Tr key={user.id}>
          <Td minWidth={{ sm: "100px" }} pl="0px">
            <Flex align="center" py="1rem" minWidth="100%" flexWrap="nowrap">
              <Text fontSize="sm" color={textColor} fontWeight="normal">
                {user.name}
              </Text>
            </Flex>
          </Td>
          <Td>
            <Text fontSize="sm" color={textColor} fontWeight="normal">
              {user.email}
            </Text>
          </Td>
          <Td>
            <Badge
              bg="green.400"
              color="white"
              fontSize="16px"
              p="3px 10px"
              borderRadius="8px"
            >
              {user.role}
            </Badge>
          </Td>
          {/* <Td>
            <Badge
              bg={user.status === "active" ? "green.400" : "red.400"}
              color="white"
              fontSize="16px"
              p="3px 10px"
              borderRadius="8px"
            >
              {user.status}
            </Badge>
          </Td> */}
        </Tr>
      ))}
    </Tbody>
  );
}

export default TablesTableRow;
