import {
  Avatar,
  Badge,
  Button,
  Flex,
  Td,
  Text,
  Tr,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tbody,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { Card } from "antd";
import axios from "axios";
import moment from "moment";
import { API_URL } from "constant/data";

function TablesHistory() {
  const textColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "#1a202c");
  const colorStatus = useColorModeValue("white", "gray.400");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/historys/token`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const historyData = response.data;
      setHistoryData(historyData);
    } catch (error) {
      console.error(error);
    }
  };

  console.log("history data",historyData);

  return (
    <Tbody>
      {historyData.map((history) => (
        <Tr key={history.id}>
          <Td minWidth={{ sm: "120px" }} pl="0px">
            <Text
              fontSize="md"
              color={textColor}
              fontWeight="bold"
              minWidth="100%"
            >
              {history.sensor_id}
            </Text>
          </Td>
          <Td>
            <Text fontSize="md" color={textColor} fontWeight="light" pb=".5rem">
              {history.user?.name}
            </Text>
          </Td>
          <Td>
            <Text fontSize="md" color={textColor} fontWeight="light" pb=".5rem">
              {history.description}
            </Text>
          </Td>
          <Td>
            <Badge
              bg={history.isEmergency === false ? "green.400" : "red.500"}
              color="white"
              fontSize="16px"
              p="3px 10px"
              borderRadius="8px"
            >
              {history.isEmergency ? "Bahaya" : "Aman"}
            </Badge>
          </Td>
          <Td>
            <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
              {moment(history.date).format("HH:mm")}
            </Text>
          </Td>
          <Td>
            <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
              {moment(history.date).format("DD MM YYYY")}
            </Text>
          </Td>
          <Td>
            <Button
              bg="#00DC7F"
              color="white"
              _hover={{ bg: "#00d179" }}
              width="100px"
              height="32px"
              borderRadius="lg"
              onClick={onOpen}
            >
              Lihat Photo
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader color="green.400">Photo</ModalHeader>
                <ModalBody>
                  <Card maxW="400px" maxH="812px" justifyContent="center">
                    {history.photo_url}
                  </Card>
                </ModalBody>
                <ModalCloseButton />
                <ModalFooter></ModalFooter>
              </ModalContent>
            </Modal>
          </Td>
        </Tr>
      ))}
    </Tbody>
  );
}

export default TablesHistory;
