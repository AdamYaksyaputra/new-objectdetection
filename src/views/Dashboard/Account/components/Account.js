// Chakra imports
import {
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
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
  Select,
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import TablesAccount from "components/Tables/TablesAccount";
import TablesTableRow from "components/Tables/TablesTableRow";
import { useState } from "react";
import { API_URL } from "constant/data";
import React from "react";
import axios from "axios";
import { useEffect } from "react";

const Account = ({ title, captions, data, submit, setSubmit, remove, setRemove, edited, setEdited }) => {
  const textColor = useColorModeValue("gray.700", "white");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const inputStyle = { border: "1px solid #000", borderRadius: "10px" };

  const [id, setID] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branch_id, setBranchID] = useState("");
  // const [status, setStatus] = useState(false);
  // const [status2, setStatus2] = useState("");
  const dataStorage = JSON.parse(localStorage.getItem('user'));

  const handleSubmit = async () => {
    console.log(name, role, email, password, branch_id)
    try {
      const { branch_id } = dataStorage;
      const response = await axios.post(`${API_URL}/api/account`, {
        // id: id,
        name: name,
        role: role,
        email: email,
        password: password,
        branch_id: parseInt(branch_id),
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSubmit(!submit);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const optionRole = [
    { value: "superadmin", label: "Super Admin" },
    { value: "admin", label: "Admin" },
    { value: "security", label: "Security" },
  ]

  //mengambil role dari api account 
  useEffect(() => {
    const getRoles = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/account`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setRoles(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    console.log(roles)
    getRoles();
  }, []);

  // useEffect(() => {
  //   if (status) {
  //     setStatus2("active");
  //   } else {
  //     setStatus2("non-active");
  //   }
  // }, [status])

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
            <ModalHeader color="green.400">Create New Account</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex justifyContent="space-between">
                <Flex flexDirection="column" width="100%">
                  <FormControl>
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <Input style={inputStyle} id="name" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
                    <FormLabel htmlFor="name" mt={4}>Role</FormLabel>
                    {/* <Input style={inputStyle} id="role" placeholder="Enter Role" value={role} onChange={(e) => setRole(e.target.value)} /> */}
                    <Select style={inputStyle} id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                      {optionRole.map((role) => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </Select>
                    <FormLabel htmlFor="name" mt={4}>Email</FormLabel>
                    <Input style={inputStyle} id="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <FormLabel htmlFor="name" mt={4}>Password</FormLabel>
                    <Input style={inputStyle} id="password" placeholder="Enter name" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {/* <Flex flexDirection="row" alignItems="flex-end">
                      <Switch colorScheme="green" size="lg" mt={4} isChecked={status} onChange={(e) => setStatus(e.target.checked)} />
                      <Text fontSize="md" color={textColor} fontWeight="Bold" pl="12px">
                        Non-Active/Active
                      </Text>
                    </Flex> */}
                    <Button bg="green.400" color="white" borderRadius="lg" w="847px" mt={4} onClick={() => handleSubmit()}>
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
                <TablesAccount
                  id={row.id}
                  name={row.name}
                  email={row.email}
                  role={row.role}
                  status={row.status}
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

export default Account;
