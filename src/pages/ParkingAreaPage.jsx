import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Button,
    Card,
    CardContent,
    CardMedia,
    Grid,
    IconButton,
    Box,
    Typography,
} from "@mui/material";
import Header from "../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import Snackbar from "../components/Snackbar";
import SlotCard from "../components/SlotCard";

const BASE_URL = "http://localhost:8000/api/v1";

const ParkingAreaPage = () => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const [parkingSlots, setParkingSlots] = useState([]);
    const [parkingArea, setParkingArea] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    const loadParkingArea = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/parkingarea/by-id/${id}`);
          if (response.data) {
            console.log(response.data);
            setParkingArea(response.data);
            setParkingSlots(response.data.parkingSlots);
          }
        } catch (error) {
          console.log(error);
        }
      }
    
      useEffect(()=> {
        loadParkingArea();
      },[])

  return (
    <div>
        <Header/>
        <Box sx={{mt: 8}}>
            <Box sx={{padding: 2, display:"flex", justifyContent: "center", alignItems:"center"}}>
                <Typography sx={{fontSize: 25}}>Book a Slot</Typography>
            </Box>
            <Box sx={{mt: 5, padding: 2}}>
                <Grid container spacing={10}>
                    {parkingSlots && parkingSlots.map((parkingSlot, index)=> <Grid item key={index} xs={12} ms={4} md={3} lg={3}>
                    <SlotCard parkingSlot = {parkingSlot} parkingArea = {parkingArea}/>
                    </Grid>)}
                </Grid>
            </Box>
        </Box>
    </div>
  )
}

export default ParkingAreaPage