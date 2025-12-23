import { Flex, Heading, StylesProvider } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Sensor from "./Components/Sensor";
import { API_URL } from "constant/data";
import axios from "axios";


function Tables() {
  const [sensorData, setSensorData] = React.useState([]);
  const [create, setCreate] = React.useState(false);
  const [remove, setRemove] = React.useState(false);
  const [edited, setEdited] = React.useState(false);

  useEffect(() => {
    const fetchDataSensor = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/sensors/token`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log(response.data);
        setSensorData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDataSensor();
  }, [create, edited, remove])


  return (
    <Flex direction='column' pt={{ base: "120px", md: "75px" }}>
      <Sensor
        title={"Sensor"}
        captions={["ID","Sensor Code", "Latitude", "Longtitude", "Status", "Action"]}
        data={sensorData} 
        create={create}
        setCreate={setCreate}
        remove={remove}
        setRemove={setRemove}
        edited={edited}
        setEdited={setEdited}
        />
    </Flex>
  );
}

export default Tables;
