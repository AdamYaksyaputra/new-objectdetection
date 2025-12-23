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
import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import moment from "moment";
import { API_URL } from "constant/data";

function TablesDashboardHistory(props) {
  const { tanggal, sensor, jenis, jam } = props;
  const textColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "#1a202c");
  const colorStatus = useColorModeValue("white", "gray.400");
  const userDataStorage = JSON.parse(localStorage.getItem("user"));

  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    fetchData();
    if (historyData.length > 0) {
      console.log(historyData);
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/historys/token`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const historyData = response.data;
      setHistoryData(historyData);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Tbody>
      {historyData.map((history) => (
        <Tr>
        <Flex justifyContent="center">
          <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
            {moment (history.date).format("DD MMMM YYYY")}
          </Text>
        </Flex>
        <Flex align="center" justifyContent="space-between" justifyItems="center">
          <Td minWidth={{ sm: "120px" }} pl="0px">
            <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
              {/* <Avatar src={logo} w="50px" borderRadius="12px" me="18px" /> */}
  
              <Flex direction="column">
                <Text
                  fontSize="md"
                  color={textColor}
                  fontWeight="bold"
                  minWidth="100%"
                >
                  {history.name}
                </Text>
                <Text fontSize="sm" color={textColor} fontWeight="normal">
                  {history.description}
                </Text>
              </Flex>
            </Flex>
  
          </Td>
          <Td>
            <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
              {moment(history.date).format("HH:mm")}
            </Text>
          </Td>
        </Flex>
      </Tr>
      ))}
    </Tbody>
  );
}

export default TablesDashboardHistory;
