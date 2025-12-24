import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Flex,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  useColorModeValue,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import { ViewIcon, TimeIcon } from "@chakra-ui/icons";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import { API_URL } from "constant/data";
import moment from "moment";

function HistoryPage() {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null); // For fullscreen photo
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isPhotoOpen, onOpen: onPhotoOpen, onClose: onPhotoClose } = useDisclosure();

  // Theme colors
  const textColor = useColorModeValue("gray.700", "white");
  const cardBg = useColorModeValue("white", "gray.700");
  const binusBlue = "#1E4DB7";

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
      setHistoryData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (event) => {
    setSelectedEvent(event);
    onOpen();
  };

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      {/* Page Header */}
      <Card mb="20px" bg={cardBg}>
        <CardHeader p="12px 5px" mb="12px">
          <Flex direction="column">
            <Flex align="center" gap="3">
              <Box bg={binusBlue} p="2" borderRadius="md">
                <TimeIcon color="white" w={5} h={5} />
              </Box>
              <Text fontSize="xl" fontWeight="bold" color={textColor}>
                Event Log - Monitoring & Investigasi
              </Text>
            </Flex>
            <Text fontSize="sm" color="gray.500" mt="2">
              Daftar kronologis kejadian keamanan untuk monitoring real-time dan investigasi insiden
            </Text>
          </Flex>
        </CardHeader>
      </Card>

      {/* History Table */}
      <Card overflowX={{ sm: "scroll", xl: "hidden" }} bg={cardBg}>
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="lg" color={textColor} fontWeight="bold">
            Daftar Kejadian
          </Text>
        </CardHeader>
        <CardBody>
          {loading ? (
            <Flex justify="center" align="center" minH="200px">
              <Spinner size="xl" color={binusBlue} />
            </Flex>
          ) : (
            <Table variant="simple" color={textColor}>
              <Thead>
                <Tr my=".8rem" pl="0px" color="gray.400">
                  <Th color="gray.400" ps="0px">Sensor ID</Th>
                  <Th color="gray.400">Security</Th>
                  <Th color="gray.400">Description</Th>
                  <Th color="gray.400">Emergency</Th>
                  <Th color="gray.400">Status</Th>
                  <Th color="gray.400">Alert Time</Th>
                  <Th color="gray.400">Report Time</Th>
                  <Th color="gray.400">Date</Th>
                  <Th color="gray.400"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {historyData.length === 0 ? (
                  <Tr>
                    <Td colSpan={9} textAlign="center" py="8">
                      <Text color="gray.500">Tidak ada data</Text>
                    </Td>
                  </Tr>
                ) : (
                  historyData.map((history) => (
                    <Tr key={history.id}>
                      <Td minWidth={{ sm: "120px" }} pl="0px">
                        <Text fontSize="md" color={textColor} fontWeight="bold">
                          {history.sensor?.code || history.sensor_id}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="md" color={textColor} fontWeight="light">
                          {history.user?.name || "N/A"}
                        </Text>
                      </Td>
                      <Td maxW="200px">
                        <Text
                          fontSize="md"
                          color={textColor}
                          fontWeight="light"
                          noOfLines={2}
                        >
                          {history.description || "-"}
                        </Text>
                      </Td>
                      <Td>
                        <Badge
                          bg={history.isEmergency ? "red.500" : "green.400"}
                          color="white"
                          fontSize="16px"
                          p="3px 10px"
                          borderRadius="8px"
                        >
                          {history.isEmergency ? "Bahaya" : "Aman"}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge
                          bg={history.status === 1 ? "yellow.400" : "green.400"}
                          color={history.status === 1 ? "gray.800" : "white"}
                          fontSize="16px"
                          p="3px 10px"
                          borderRadius="8px"
                        >
                          {history.status === 1 ? "Notifikasi Terkirim" : "Selesai"}
                        </Badge>
                      </Td>
                      <Td>
                        <Text fontSize="md" color={textColor} fontWeight="bold">
                          {moment(history.createdAt).format("HH:mm")}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="md" color={textColor} fontWeight="bold">
                          {moment(history.updatedAt).format("HH:mm")}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="md" color={textColor} fontWeight="bold">
                          {moment(history.date).format("DD MMM YYYY")}
                        </Text>
                      </Td>
                      <Td>
                        <Button
                          leftIcon={<ViewIcon />}
                          bg={binusBlue}
                          color="white"
                          _hover={{ bg: "#163a8a" }}
                          size="sm"
                          borderRadius="md"
                          onClick={() => handleViewDetail(history)}
                        >
                          Detail
                        </Button>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color={binusBlue}>Detail Kejadian</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedEvent && (
              <Box>
                <Flex direction="column" gap="3" mb="4">
                  <Flex justify="space-between">
                    <Text fontWeight="bold" color="gray.500">Sensor:</Text>
                    <Text>{selectedEvent.sensor?.code || selectedEvent.sensor_id}</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text fontWeight="bold" color="gray.500">Waktu:</Text>
                    <Text>{moment(selectedEvent.date).format("DD MMM YYYY, HH:mm")}</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text fontWeight="bold" color="gray.500">Security:</Text>
                    <Text>{selectedEvent.user?.name || "N/A"}</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text fontWeight="bold" color="gray.500">Status:</Text>
                    <Badge colorScheme={selectedEvent.isEmergency ? "red" : "green"}>
                      {selectedEvent.isEmergency ? "Bahaya" : "Aman"}
                    </Badge>
                  </Flex>
                  <Box>
                    <Text fontWeight="bold" color="gray.500" mb="1">Deskripsi:</Text>
                    <Text>{selectedEvent.description || "Tidak ada deskripsi"}</Text>
                  </Box>
                </Flex>

                {selectedEvent.photo_url && (
                  <Box mt="4">
                    <Text fontWeight="bold" color="gray.500" mb="2">Bukti Foto: (klik untuk memperbesar)</Text>
                    <Image
                      src={selectedEvent.photo_url}
                      alt="Evidence"
                      borderRadius="md"
                      maxH="300px"
                      objectFit="contain"
                      cursor="pointer"
                      _hover={{ opacity: 0.8, transform: "scale(1.02)" }}
                      transition="all 0.2s"
                      onClick={() => {
                        setPhotoUrl(selectedEvent.photo_url);
                        onPhotoOpen();
                      }}
                      fallback={
                        <Flex
                          bg="gray.100"
                          h="200px"
                          align="center"
                          justify="center"
                          borderRadius="md"
                        >
                          <Text color="gray.500">Foto tidak tersedia</Text>
                        </Flex>
                      }
                    />
                  </Box>
                )}
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button bg={binusBlue} color="white" onClick={onClose} _hover={{ bg: "#163a8a" }}>
              Tutup
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Photo Lightbox Modal */}
      <Modal isOpen={isPhotoOpen} onClose={onPhotoClose} size="full">
        <ModalOverlay bg="blackAlpha.900" />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalCloseButton color="white" size="lg" zIndex="2" />
          <ModalBody
            display="flex"
            alignItems="center"
            justifyContent="center"
            p="4"
            onClick={onPhotoClose}
          >
            {photoUrl && (
              <Image
                src={photoUrl}
                alt="Evidence Full"
                maxH="90vh"
                maxW="90vw"
                objectFit="contain"
                borderRadius="md"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default HistoryPage;
