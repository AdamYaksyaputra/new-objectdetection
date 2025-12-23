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
    FormErrorMessage,
    FormHelperText,
    Input,
    Switch,
    Select,
} from "@chakra-ui/react";

import React from "react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useDisclosure } from "@chakra-ui/react"
import { API_URL } from "constant/data";

function TableAccount(props) {
    const { name, email, role, status, id, remove, setRemove, password, branch_id, status2, edited, setEdited } = props;
    const inputStyle = { border: "1px solid #000", borderRadius: "10px" };
    const textColor = useColorModeValue("gray.700", "white");
    const bgStatus = useColorModeValue("gray.400", "#1a202c");
    const colorStatus = useColorModeValue("white", "gray.400");
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [editedName, setEditedName] = useState(name);
    const [editedRole, setEditedRole] = useState(role);
    const [editedEmail, setEditedEmail] = useState(email);
    const [editedPassword, setEditedPassword] = useState(password);
    const [editedBranchID, setEditedBranchID] = useState(branch_id);
    const dataStorage = JSON.parse(localStorage.getItem('user'));
    // const [editedStatus, setEditedStatus] = useState(status);
    // const [editedStatus2, setEditedStatus2] = useState(status2);

    const handleEdit = async () => {
        try {
            const response = await axios.put(`${API_URL}/api/account/${id}`, {
                name: editedName,
                role: editedRole,
                email: editedEmail,
                password: editedPassword,
                branch_id: editedBranchID,
                // status: editedStatus2,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            // Lakukan tindakan yang diperlukan setelah pengeditan berhasil
            setEdited(!edited);
            onClose();
            console.log("Account edited successfully!");
        } catch (error) {
            console.error(error);
        }
    };

    const optionRole = [
        { value: "superadmin", label: "Super Admin" },
        { value: "admin", label: "Admin" },
        { value: "security", label: "Security" },
      ]


    // useEffect(() => {
    //     if (editedStatus) {
    //         setEditedStatus2("active");
    //     } else {
    //         setEditedStatus2("non-active");
    //     }
    // }, [editedStatus])

    const handleDelete = async () => {
        console.log(props.id);
        try {
            // Kirim permintaan penghapusan ke API endpoint
            const response = await axios.delete(`${API_URL}/api/account/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setRemove(!remove);
            // Lakukan tindakan yang diperlukan setelah penghapusan berhasil
            console.log("Account deleted successfully!");
            // Misalnya, muat ulang data setelah penghapusan berhasil
        } catch (error) {
            console.error(error);
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
                        {name}
                    </Text>

                </Td>
                <Td>
                    <Text fontSize="md" color={textColor} fontWeight="light" pb=".5rem">
                        {email}
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
                        {role}
                    </Badge>
                </Td>

                {/* <Td>
                    <Badge
                        bg={status === "active" ? "green.400" : "red.400"}
                        color="white"
                        fontSize="16px"
                        p="3px 10px"
                        borderRadius="8px"
                    >
                        {status}
                    </Badge>
                </Td> */}
                <Td>
                    <Flex justifyContent="space-between" maxWidth="140px">
                        <Button onClick={onOpen} bg="white" color="black" width="65px" height="32px" borderRadius="lg" borderColor="black" border="1px" >
                            Edit
                        </Button>
                        <Button bg="red.500" color="white" _hover={{ bg: "#eb7668" }} width="65px" height="32px" borderRadius="lg" onClick={() => handleDelete(id)}>
                            Delete
                        </Button>
                    </Flex>
                </Td>
            </Tr>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent maxW="56rem" minW="24.375rem" maxh="482px">
                    <ModalHeader color="green.400">Edit {name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex justifyContent="space-between">
                            <Flex flexDirection="column" width="100%">
                                <FormControl>
                                    <FormLabel htmlFor="name">Name</FormLabel>
                                    <Input style={inputStyle} id="name" placeholder="Enter name" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                                    <FormLabel htmlFor="name" mt={4}>Role</FormLabel>
                                    <Select style={inputStyle} id="role" value={editedRole} onChange={(e) => setEditedRole(e.target.value)}>
                                        {optionRole.map((role) => (
                                            <option key={role.value} value={role.value}>{role.label}</option>
                                        ))}
                                    </Select>
                                    <FormLabel htmlFor="name" mt={4}>Email</FormLabel>
                                    <Input style={inputStyle} id="email" placeholder="Enter Email" value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} />
                                    {/* <FormLabel htmlFor="name" mt={4}>Password</FormLabel>
                                    <Input style={inputStyle} id="password" placeholder="Enter name" value={editedPassword} onChange={(e) => setEditedPassword(e.target.value)} /> */}

                                    {/* <Flex flexDirection="row" alignItems="flex-end">
                                        <Switch colorScheme="green" size="lg" mt={4} isChecked={editedStatus} onChange={(e) => setEditedStatus(e.target.checked)} />
                                        <Text fontSize="md" color={textColor} fontWeight="Bold" pl="12px">
                                            Non-Active/Active
                                        </Text>
                                    </Flex> */}
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
        </>
    );
}


export default TableAccount;
