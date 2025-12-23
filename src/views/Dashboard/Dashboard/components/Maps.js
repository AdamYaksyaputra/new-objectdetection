// Chakra imports
import {
    Table,
    Tbody,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import { useMemo } from "react";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import React from "react";

export default function Maps() {
    const textColor = useColorModeValue("gray.700", "white");
    return (
        <Card overflowX={{ sm: "scroll", xl: "hidden" }} boxShadow="md">
            <CardHeader p='6px 0px 22px 0px'>
                <Text fontSize='xl' color={textColor} fontWeight='bold'>
                    Location
                </Text>
            </CardHeader>
            <CardBody>
                <iframe width="100%" height="600" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Jl.%20Araya%20Mansion%20No.8%20-%2022,%20Genitri,%20Tirtomoyo,%20Kec.%20Pakis,%20Kabupaten%20Malang,%20Jawa%20Timur%2065154+(BINUS%20University%20Malang)&amp;t=&amp;z=18&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.maps.ie/distance-area-calculator.html">measure area map</a></iframe>
            </CardBody>
        </Card>
    );
};
