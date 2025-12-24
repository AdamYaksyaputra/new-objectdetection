import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    Badge,
    Button,
    Flex,
    Image,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    useDisclosure,
    useColorModeValue,
    Spinner,
    Box,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import moment from "moment";

function HistoryTable({ data, loading, captions }) {
    const textColor = useColorModeValue("gray.700", "white");
    const hoverBg = useColorModeValue("gray.50", "gray.600");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleViewPhoto = (history) => {
        setSelectedPhoto(history.photo_url);
        setSelectedEvent(history);
        onOpen();
    };

    if (loading) {
        return (
            <Flex justify="center" align="center" py="8">
                <Spinner size="xl" color="#1E4DB7" />
            </Flex>
        );
    }

    return (
        <>
            <Table variant="simple" color={textColor}>
                <Thead>
                    <Tr my=".8rem" pl="0px" color="gray.400">
                        {captions.map((caption, idx) => (
                            <Th color="gray.400" key={idx} ps={idx === 0 ? "0px" : null}>
                                {caption}
                            </Th>
                        ))}
                    </Tr>
                </Thead>
                <Tbody>
                    {data.length === 0 ? (
                        <Tr>
                            <Td colSpan={9} textAlign="center" py="8">
                                <Text color="gray.500">Tidak ada data</Text>
                            </Td>
                        </Tr>
                    ) : (
                        data.map((history) => (
                            <Tr
                                key={history.id}
                                _hover={{ bg: hoverBg, cursor: "pointer" }}
                                transition="background 0.2s"
                            >
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
                                        title={history.description}
                                    >
                                        {history.description || "-"}
                                    </Text>
                                </Td>
                                <Td>
                                    <Badge
                                        bg={history.isEmergency ? "red.500" : "green.400"}
                                        color="white"
                                        fontSize="14px"
                                        p="4px 12px"
                                        borderRadius="8px"
                                    >
                                        {history.isEmergency ? "⚠️ Bahaya" : "✓ Aman"}
                                    </Badge>
                                </Td>
                                <Td>
                                    <Badge
                                        bg={history.status === 1 ? "yellow.400" : "green.400"}
                                        color={history.status === 1 ? "gray.800" : "white"}
                                        fontSize="14px"
                                        p="4px 12px"
                                        borderRadius="8px"
                                    >
                                        {history.status === 1 ? "Pending" : "Selesai"}
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
                                        bg="#1E4DB7"
                                        color="white"
                                        _hover={{ bg: "#163a8a" }}
                                        size="sm"
                                        borderRadius="md"
                                        onClick={() => handleViewPhoto(history)}
                                    >
                                        Detail
                                    </Button>
                                </Td>
                            </Tr>
                        ))
                    )}
                </Tbody>
            </Table>

            {/* Detail Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader color="#1E4DB7">
                        Detail Kejadian
                    </ModalHeader>
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
                                        <Badge
                                            colorScheme={selectedEvent.isEmergency ? "red" : "green"}
                                        >
                                            {selectedEvent.isEmergency ? "Bahaya" : "Aman"}
                                        </Badge>
                                    </Flex>
                                    <Box>
                                        <Text fontWeight="bold" color="gray.500" mb="1">Deskripsi:</Text>
                                        <Text>{selectedEvent.description || "Tidak ada deskripsi"}</Text>
                                    </Box>
                                </Flex>

                                {selectedPhoto && (
                                    <Box mt="4">
                                        <Text fontWeight="bold" color="gray.500" mb="2">Bukti Foto:</Text>
                                        <Image
                                            src={selectedPhoto}
                                            alt="Evidence"
                                            borderRadius="md"
                                            maxH="300px"
                                            objectFit="contain"
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
                        <Button colorScheme="blue" onClick={onClose}>
                            Tutup
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default HistoryTable;
