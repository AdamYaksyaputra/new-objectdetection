import { Flex, Heading, StylesProvider } from "@chakra-ui/react";
import React from "react";
import History from "./components/History";


function Tables() {
  return (
    <Flex direction='column' pt={{ base: "120px", md: "75px" }}>
        <History
          title={"History"}
          captions={["Sensor ID", "Security", "Description", "Status", "Clock", "Date", ""]}
          />
    </Flex>
  );
}

export default Tables;
