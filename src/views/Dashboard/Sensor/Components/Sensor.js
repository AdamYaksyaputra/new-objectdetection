// Chakra imports
import {
    Table,
    Tbody,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Switch,
} from "@chakra-ui/react";
import { Grid } from "antd";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import TablesSensor from "components/Tables/TableSensor";
import TablesTableRow from "components/Tables/TablesTableRow";
import { useState } from "react";
import axios from "axios";
import React from "react";
import { useDisclosure } from "@chakra-ui/react";
import { API_URL } from "constant/data";
import { useEffect } from "react";
import TableSensor from "components/Tables/TableSensor";

const Sensor = ({ title, captions, data, create, setCreate, remove, setRemove, edited, setEdited }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const textColor = useColorModeValue("gray.700", "white");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [status, setStatus] = useState(false);
    const [status2, setStatus2] = useState("");
    const [code, setCode] = useState("");
    const [isOn, setIsOn] = useState(false);
    const [isOn2, setIsOn2] = useState("");

    const dataUser = JSON.parse(localStorage.getItem("user"));

    const handleCreate = async () => {
        console.log(latitude, longitude, isOn2)
        try {
            const response = await axios.post(`${API_URL}/api/sensor`, {
                code: code,
                latitude: latitude,
                longitude: longitude,
                isOn: isOn,
                branch_id: dataUser.branch_id,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            setCreate(!create);
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (isOn) {
            setIsOn2("true");
        } else {
            setIsOn2("false");
        }
    }, [isOn])


    return (
        <Card overflowX={{ sm: "scroll", xl: "hidden" }}>
            <CardHeader p='6px 0px 22px 0px' justifyContent="space-between">
                <Text fontSize='xl' color={textColor} fontWeight='bold'>
                    {title}
                </Text>
                <Button w="65px" h="30px" onClick={onOpen} bg="green.400" color="white" borderRadius="lg" _hover={{ bg: "#00d179" }}>
                    Create
                </Button>
                <Modal isOpen={isOpen} onClose={onClose} isCentered>
                    <ModalOverlay />
                    <ModalContent maxW="56rem" minW="24.375rem" maxh="482px">
                        <ModalHeader color="green.400">Create Sensor</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Flex justifyContent="space-between">
                                <Flex flexDirection="column" width="100%">
                                    <FormControl>
                                        <FormLabel htmlFor="latitude" mt={4}>sensor Code</FormLabel>
                                        <Input id="latitude" placeholder="Sensor Code" value={code} onChange={(e) => setCode(e.target.value)} />
                                        <FormLabel htmlFor="latitude" mt={4}>Latitude</FormLabel>
                                        <Input id="latitude" placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
                                        <FormLabel htmlFor="longitude" mt={4}>Longitude</FormLabel>
                                        <Input id="longitude" placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
                                        <Flex flexDirection="row" alignItems="flex-end">
                                            <Switch colorScheme="green" size="lg" mt={4} isChecked={isOn} onChange={(e) => setIsOn(e.target.checked)} />
                                            <Text fontSize="md" color={textColor} fontWeight="Bold" pl="12px" >
                                                Status
                                            </Text>
                                        </Flex>
                                        <Button bg="green.400" color="white" borderRadius="lg" w="847px" mt={4} onClick={() => handleCreate()}>
                                            Create
                                        </Button>
                                    </FormControl>
                                </Flex>
                            </Flex>
                        </ModalBody>
                        <ModalFooter justifyContent="center">
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </CardHeader>
            <CardBody>
                <Table variant='simple' color={textColor}>
                    <Thead>
                        <Tr my='.8rem' pl='0px' color='gray.400'>
                            {captions.map((caption, idx) => {
                                return (
                                    <Th color='gray.400' key={idx} ps={idx === 0 ? "0px" : null}>
                                        {caption}
                                    </Th>
                                );
                            })}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data.map((row) => {
                            return (
                                <TableSensor
                                    key={row.id}
                                    id={row.id}
                                    code={row.code}
                                    sensor={row.id}
                                    latitude={row.latitude}
                                    longtitude={row.longitude}
                                    isOn={row.isOn}
                                    remove={remove}
                                    setRemove={setRemove}
                                    edited={edited}
                                    setEdited={setEdited}
                                />
                            );
                        })}
                    </Tbody>
                </Table>
            </CardBody>
        </Card>
    );
};

export default Sensor;
