import { Flex, Heading, StylesProvider } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Account from "./components/Account";
import { API_URL } from "constant/data";
import axios from "axios";

function Tables() {

  const [accountData, setAccountData] = React.useState([]);
  const [submit, setSubmit] = React.useState(false);
  const [remove, setRemove] = React.useState(false);
  const [edited, setEdited] = React.useState(false);

  useEffect(() => {
    const fetchDataAccount = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/accounts/token`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        console.log(response.data);
        setAccountData(response.data);

      } catch (error) {
        console.error(error);
      }
    }
    fetchDataAccount();
  }, [submit, remove, edited])

  return (
    <Flex direction='column' pt={{ base: "120px", md: "75px" }}>
      <Account
        title={"Account"}
        captions={["Name", "Email", "Role", "Action"]}
        data={accountData} 
        submit={submit}
        setSubmit={setSubmit}
        remove={remove}
        setRemove={setRemove}
        edited={edited}
        setEdited={setEdited}
        />
    </Flex>
  );
}

export default Tables;
