import {
    Avatar,
    Badge,
    Button,
    Flex,
    Td,
    Text,
    Tr,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useColorModeValue,
    FormControl,
    FormLabel,
    Input,
    Switch,
} from "@chakra-ui/react";
import React from "react";
import { useDisclosure } from "@chakra-ui/react";
import { API_URL } from "constant/data";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function TableSensor(props) {
    const { id, code, sensor, latitude, longtitude, status, remove, setRemove, edited, setEdited, status2, isOn, isOn2 } = props;
    const textColor = useColorModeValue("gray.700", "white");
    const inputStyle = { border: "1px solid #000", borderRadius: "10px" };
    const bgStatus = useColorModeValue("gray.400", "#1a202c");
    const colorStatus = useColorModeValue("white", "gray.400");
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [editedLongtitude, setEditedLongtitude] = useState(longtitude);
    const [editedLatitude, setEditedLatitude] = useState(latitude);
    const [editedStatus, setEditedStatus] = useState(status);
    const [editedStatus2, setEditedStatus2] = useState(status2)
    const [editedCode, setEditedCode] = useState(code);
    const [editedIsOn, setEditedIsOn] = useState(isOn);
    const [editedIsOn2, setEditedIsOn2] = useState(isOn2);

    const handleEdit = async () => {
        try {
            const response = await axios.put(
                `${API_URL}/api/sensor/${id}`,
                {
                    code: editedCode,
                    longitude: editedLongtitude,
                    latitude: editedLatitude,
                    isOn: editedIsOn2, // Menggunakan editedStatus2 bukan editedStatus
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setEdited(!edited);
            toast.success("Sensor Edited Successfully!");
            onClose();
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        if (editedIsOn) {
            setEditedIsOn2("true");
        } else {
            setEditedIsOn2("false");
        }
    }, [editedIsOn])

    const handleDelete = async () => {
        const confirmation = window.confirm("Are you sure you want to delete this sensor?");
        if (!confirmation) return;
        try {
            const response = await axios.delete(`${API_URL}/api/sensor/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setRemove(!remove);
            console.log("Account Deleted Successfully!");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Tr>
                <Td minWidth={{ sm: "120px" }} pl="0px">
                    <Text
                        fontSize="md"
                        color={textColor}
                        fontWeight="bold"
                        minWidth="100%"
                    >
                        {sensor}
                    </Text>

                </Td>
                <Td>
                    <Text fontSize="md" color={textColor} fontWeight="light" pb=".5rem">
                        {code}
                    </Text>
                </Td>
                <Td>
                    <Text fontSize="md" color={textColor} fontWeight="light" pb=".5rem">
                        {latitude}
                    </Text>
                </Td>
                <Td>
                    <Text fontSize="md" color={textColor} fontWeight="light" pb=".5rem">
                        {longtitude}
                    </Text>
                </Td>

                <Td>
                    <Badge
                        bg={isOn === true ? "green.400" : "red.400"}
                        color="white"
                        fontSize="16px"
                        p="3px 10px"
                        borderRadius="8px"
                    >
                        {isOn ? "On" : "Off"}
                    </Badge>
                </Td>
                <Td>
                    <Flex justifyContent="space-between" maxWidth="140px">
                        <Button onClick={onOpen} bg="white" color="black" width="65px" height="32px" borderRadius="lg" borderColor="black" border="1px">
                            Edit
                        </Button>
                        <Button bg="red.500" color="white" _hover={{ bg: "#eb7668" }} width="65px" height="32px" borderRadius="lg" onClick={() => handleDelete(id)}>
                            Delete
                        </Button>
                    </Flex>
                    <Modal isOpen={isOpen} onClose={onClose} isCentered>
                        <ModalOverlay />
                        <ModalContent maxW="56rem" minW="24.375rem" maxh="482px">
                            <ModalHeader color="green.400">Edit Sensor {sensor}</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Flex justifyContent="space-between">
                                    <Flex flexDirection="column" width="100%">
                                        <FormControl>
                                            <FormLabel htmlFor="name">Code</FormLabel>
                                            <Input style={inputStyle} id="code" placeholder="Code" value={editedCode} onChange={(e) => setEditedCode(e.target.value)} />
                                            <FormLabel htmlFor="name">Latitude</FormLabel>
                                            <Input style={inputStyle} id="latitude" placeholder="Latitude" value={editedLatitude} onChange={(e) => setEditedLatitude(e.target.value)} />
                                            <FormLabel htmlFor="name" mt={4}>Longtitude</FormLabel>
                                            <Input style={inputStyle} id="longtitude" placeholder="Longtitude" value={editedLongtitude} onChange={(e) => setEditedLongtitude(e.target.value)} />
                                            <Flex flexDirection="row" alignItems="flex-end">
                                                <Switch isChecked={editedIsOn} onChange={(e) => setEditedIsOn(e.target.checked)} colorScheme="green" size="lg" mt={4} />
                                                <Text fontSize="md" color={textColor} fontWeight="Bold" pl="12px">
                                                    Status
                                                </Text>
                                            </Flex>
                                            <Button bg="green.400" color="white" borderRadius="lg" w="847px" mt={4} onClick={() => handleEdit(id)}>
                                                Edit
                                            </Button>
                                        </FormControl>
                                    </Flex>
                                </Flex>
                            </ModalBody>
                            <ModalFooter justifyContent="center">
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Td>
            </Tr>
        </>
    );
}


export default TableSensor;
