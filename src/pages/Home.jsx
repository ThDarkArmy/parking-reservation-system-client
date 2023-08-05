import React, { useState, useEffect } from 'react'
import Header from '../components/Header';
import { Typography, Box, TextField, Grid, Card, CardMedia, CardActionArea } from '@mui/material';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ImageSlider from "../components/ImageSlider";
import Img1 from "../images/img1.jpeg";
import Img2 from "../images/img2.jpg";
import Img3 from "../images/img3.webp";
import Img4 from "../images/img4.jpg";
import Img5 from "../images/img5.jpg";

const BASE_URL = "http://localhost:8000/api/v1";

const Home = () => {
  const topImages = [Img1, Img2, Img3, Img4, Img5]
  const [parkingArea, setParkingArea] = useState([]);
  const [parkingAreaToDisplay, setParkingAreaToDisplay] = useState([]);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadParkingLots();
    parkingAreaToDisplay.map((parkingArea) =>{
      console.log(parkingArea);
    })
    console.log(parkingAreaToDisplay)
  }, [])

  const loadParkingLots = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/parkingarea/all`);
      if (response.data) {
        setParkingArea(response.data);
        setParkingAreaToDisplay(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const parkingAreaToDisplay = parkingArea.filter(parkingLot => parkingLot.address.toLowerCase().includes(searchText.toLowerCase()));
    setParkingAreaToDisplay(parkingAreaToDisplay)
  }, [searchText])


  return (
    <div>
      <Header />
      <Box sx={{ mt: 8, maxWidth: "100%" }}>
        <ImageSlider topImages={topImages} />

        <Box sx={{ display: "block",  justifyContent: "center", alignItems: "center", padding: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 2 }}>
            <Typography sx={{ fontSize: 25 }}>Parking Areas</Typography>
          </Box>
          <Box sx={{mt: 2}}>
            <Grid container spacing={10}>
              { parkingAreaToDisplay && parkingAreaToDisplay.map((parkingArea, index)=> {
              return <Grid key={index} item xs={12} sm={6} md={4} lg={4}>
                  <Card sx={{cursor: "pointer"}} onClick={()=> navigate("/parking-area/"+parkingArea.id)}>
                    <Box flexDirection="column" display="flex" justifyContent="center" alignItems="center">
                    <CardMedia
                        component="img"
                        height="400"
                        width="300"
                        image={parkingArea.imageUrl}
                        alt={"Img1"}
                        sx={{mb: -2}}
                    />
                    <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", mt: -2}}>
                      <Typography sx={{mt: 0}} >{parkingArea.address}</Typography>
                      <Typography sx={{mt: 0}} >{`Charge: ${parkingArea.chargePerHour}/hr`}</Typography>
                    </Box>
                    </Box>
                  </Card>
              </Grid>})}
            </Grid>
          </Box>
        </Box>
      </Box>
    </div>
  )
}

export default Home