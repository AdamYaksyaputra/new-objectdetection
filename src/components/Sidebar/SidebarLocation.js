import {
    Button,
    Flex,
    Text,
    useColorModeValue,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Grid,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input

} from "@chakra-ui/react";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import React, { useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { useDisclosure } from "@chakra-ui/react";
import axios, { all } from "axios";
import { useState } from "react";
import apiUserData from "../../service/apiUserData";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from "constant/data";


export function SidebarLocation() {

    const textColor = useColorModeValue("gray.700", "white");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure();
    const [userDataStorage, setUserDataStorage] = useState(() => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    });
    const [allBranch, setAllBranch] = useState([
        {
            id: 0,
            name: "",
            location: ""
        },
    ]);
    const [currentBranch, setCurrentBranch] = useState({});
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!userDataStorage || !userDataStorage.branch_id) {
                return;
            }
            try {
                const response = await axios.get(`${API_URL}/api/branch/${userDataStorage.branch_id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setCurrentBranch(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [userDataStorage?.branch_id]);
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post(`${API_URL}/api/branch`, { name: name, city: location }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            toast.success("Location created successfully!")
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2000);
        } catch (error) {
            console.error(error);
        }
    }

    const handleNameChange = (event) => {
        setName(event.target.value);
    }

    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    }


    const handleLocation = async () => {
        // get branch id from user local storage
        if (!userDataStorage) {
            toast.error("User data not found. Please login again.");
            return;
        }
        onOpen2();

        // if user is superadmin, can get all branch
        if (userDataStorage.role === "superadmin") {
            try {
                // fetch api with header token to get all branch
                const response = await axios.get(`${API_URL}/api/branch`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setAllBranch(response.data);
            } catch (error) {
                console.error(error);
            }
        } else {
            // if user is admin, can get branch with id
            if (!userDataStorage.branch_id) {
                toast.error("Branch ID not found. Please contact administrator.");
                return;
            }
            try {
                // fetch api with header token to get all branch
                const response = await axios.get(`${API_URL}/api/branch/${userDataStorage.branch_id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                console.log("RESPONSE BRANCH", response.data)
                setAllBranch(response.data);
            } catch (error) {
                console.error(error);
            }
        }
    }
    

    const handleChangeBranch = async (branchId) => {
        // update data user with branch id to api
        if (!userDataStorage || !userDataStorage.id) {
            toast.error("User data not found. Please login again.");
            return;
        }
        try {
            const response = await axios.put(`${API_URL}/api/account/${userDataStorage.id}`, { branch_id: branchId }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(response.data)
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('token', response.data.token);
            toast.success("Location changed successfully!")
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2000);
        } catch (error) {
            console.error(error);
        }
    }
    
    const branchName = (branchId) => {
        const branch = allBranch.find(branch => branch.id === branchId);
        return branch?.name;
    }

    const branchLocation = (branchId) => {
        const branch = allBranch.find(branch => branch.id === branchId);
        return branch?.location;
    }
    

    return (
        <>
            <Card p="1rem" my={{ sm: "24px", xl: "0px" }} boxShadow="md">
                <CardHeader p="12px 5px" mb="12px">
                    <Flex justify="space-between" align="flex-start" flexDirection="column" minHeight="30px" w="100%">
                        <Text fontSize="sm" color={textColor} fontWeight="bold">
                            {currentBranch.name || "Branch Name"}
                        </Text>
                        <Text fontSize="sm" color={textColor} fontWeight="light">
                            {currentBranch.location || "Location"}
                        </Text>
                    </Flex>
                </CardHeader>
                <Flex justify="space-between" align="" flexDirection="column" minHeight="30px" w="100%">
                    <Button bg="#00A861" _hover={{ bg: "#00d179" }} size="xs" color={"white"} onClick={handleLocation}>Change Location</Button>
                    <Modal onClose={onClose2} isOpen={isOpen2} isCentered>
                        <ModalOverlay />
                        <ModalContent maxW="56rem" w="90%">
                            <ModalHeader>
                                Change Location
                                <Button bg="#00A861" _hover={{ bg: "#00d179" }} size="sm" color={"white"} ml="20px" onClick={() => onOpen()}>Create</Button>
                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                                    {allBranch.map((branch) => (
                                        <Card p="1rem" my={{ sm: "24px", xl: "0px" }} border='1px' borderColor='gray.200' boxShadow="md">
                                            <CardHeader p="12px 5px" mb="12px">
                                                <Flex justify="space-between" align="center" flexDirection="column" minHeight="30px" w="100%">
                                                    <Text fontSize="md" color={textColor} fontWeight="Bold" justifyContent={"center"}>
                                                        {branch.name}
                                                    </Text>
                                                </Flex>
                                            </CardHeader>
                                            <Flex justify="space-between" align="center" flexDirection="column" minHeight="30px" w="100%">
                                                <Button onClick={() => handleChangeBranch(branch.id)} size="sm" w="100%" bg="#00A861" _hover={{ bg: "#00d179" }} color={"white"}
                                                    disabled={userDataStorage?.branch_id === branch.id ? true : false}
                                                >Change Location</Button>
                                            </Flex>
                                        </Card>
                                    ))
                                    }
                                </Grid>
                            </ModalBody>
                            <ModalFooter>
                                <Button onClick={onClose2}>Close</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                    <Modal onClose={onClose} isOpen={isOpen} isCentered>
                        <ModalOverlay />
                        <ModalContent maxW="36rem" w="90%">
                            <ModalHeader> Create Location</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Formik>
                                    <Form onSubmit={handleSubmit}>
                                            <FormLabel htmlFor="name">Nama</FormLabel>
                                            <Input id="name" placeholder="Nama" value={name} onChange={handleNameChange} />
                                            <FormLabel htmlFor="name" mt={4}>Location</FormLabel>
                                            <Input id="name" placeholder="Location" value={location} onChange={handleLocationChange} />
                                        <Button mt={4} colorScheme="teal" type="submit" bg="#00A861" _hover={{ bg: "#00d179" }} color={"white"} w="100%">
                                            Create
                                        </Button>
                                    </Form>
                                </Formik>
                            </ModalBody>
                            <ModalFooter>
                                <Button onClick={onClose}>Close</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Flex>
            </Card>
        </>
    );
}
