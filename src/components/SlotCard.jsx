import React, { useState } from "react";
import axios from "axios";

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
  Card
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "../components/Snackbar";

import { useNavigate } from "react-router-dom";
import SnackBar from "../components/Snackbar";

const BASE_URL = "http://localhost:8000/api/v1";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const SlotCard = ({ parkingSlot, parkingArea }) => {

  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const [openBookSlotForm, setOpenBookSlotForm] = useState(false);
  const [showValidationError, setshowValidationError] = useState(false);
  const [parkingSlotId, setParkingSlotId] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [paymentDialog, setPaymentDialog] = useState(false);

  const [arrivalDateTime, setArrivalTime] = useState("");
  const [departureDateTime, setDepartureDateTime] = useState("");

  const bookSlot = async () => {
    console.log(new Date(arrivalDateTime)>=new Date(departureDateTime))
    if (
      arrivalDateTime === "" ||
      vehicleNumber === "" ||
      departureDateTime === "" ||
      vehicleName === "" ||
      parkingSlotId === "")
    {
      setshowValidationError(true);

    }else if(new Date(arrivalDateTime)>=new Date(departureDateTime)){
      setshowValidationError(true);
    }
    else  {
      const bookSlotdata = { arrivalDateTime, departureDateTime, vehicleName, vehicleNumber, parkingSlotId };
      try {
        const response = await axios({
          method: "post",
          url: BASE_URL + "/bookparkingslot/",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + token,
          },
          data: JSON.stringify(bookSlotdata)
        });

        if (response.data) {
          setOpenSnackbar(true);
          setSnackbarMessage("Parking slot booked successfully");
          setSnackbarSeverity("success")
          setArrivalTime("");
          setDepartureDateTime("");
          setVehicleNumber("");
          setVehicleName("");
          setParkingSlotId("");
          setPaymentDialog(false);
        }
      } catch (err) {
        console.log(err);
        setOpenSnackbar(true);
        setSnackbarMessage("Some error occured while booking slot");
        setSnackbarSeverity("error")
      }
    }
  };


  const handleOpenBookSlotForm = () => {
    if (!token) {
      navigate("/login-register");
    } else {
      if (parkingSlot.booked) {
        setOpenSnackbar(true);
        setSnackbarMessage("Parking slot is already booked");
        setSnackbarSeverity("warning")
      } else {
        setParkingSlotId(parkingSlot.id);
        setOpenBookSlotForm(true);
      }
    }

  }

  return (
    <div>
      <SnackBar snackbarSeverity={snackbarSeverity} snackbarMessage={snackbarMessage} openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} />
      <Card onClick={() => handleOpenBookSlotForm()} sx={{ cursor: "pointer", bgcolor: "burlywood", height: 180, width: 250, padding: 1 }}>
        <Box sx={{ bgcolor: "#fff", padding: 1 }}>
          <Typography>{`Slot Number: ${parkingSlot.slotNumber}`}</Typography>
        </Box>
        <Box sx={{ bgcolor: "#fff", padding: 1, mt: 1 }}>
          <Typography>{`Address: ${parkingArea.address}`}</Typography>
        </Box>
        <Box sx={{ bgcolor: "#fff", padding: 1, mt: 1 }}>
          <Typography>{`Charge: ${parkingArea.chargePerHour}/hr`}</Typography>
        </Box>
        <Box sx={{ bgcolor: "#fff", padding: 1, mt: 1 }}>
          <Typography>{`${parkingSlot.booked ? "Not Available" : "Available"}`}</Typography>
        </Box>
      </Card>
      <Dialog open={openBookSlotForm} onClose={() => setOpenBookSlotForm(false)}>
        <DialogTitle>Book slot</DialogTitle>
        <DialogContent>
          {showValidationError && (
            <Alert severity="error">Please enter valid entries in all fields</Alert>
          )}
          <TextField
            size="small"
            label="Vehicle Name"
            fullWidth
            type="text"
            onChange={(e) => {
              setshowValidationError(false);
              setVehicleName(e.target.value);
            }}
            value={vehicleName}
            sx={{ mt: 2 }}
          />
          <TextField
            size="small"
            label="Vehicle Number"
            fullWidth
            value={vehicleNumber}
            type="text"
            onChange={(e) => {
              setshowValidationError(false);
              setVehicleNumber(e.target.value);
            }}
            sx={{ mt: 2 }}
          />
          <TextField
            size="small"
            label="Arrival Time"
            fullWidth
            type="datetime-local"
            onChange={(e) => {
              setshowValidationError(false);
              setArrivalTime(e.target.value);
            }}
            sx={{ mt: 2 }}
          />
          <TextField
            size="small"
            label="Departure Time"
            fullWidth
            type="datetime-local"
            onChange={(e) => {
              setshowValidationError(false);
              setDepartureDateTime(e.target.value);
            }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBookSlotForm(false)}>Cancel</Button>
          <Button onClick={() => setPaymentDialog(true)}>Book Slot</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={paymentDialog} onClose={() => setPaymentDialog(false)}>
        <DialogTitle>Make Payment</DialogTitle>
        <DialogContent>
          {showValidationError && (
            <Alert severity="error">Please enter valid entries in all fields</Alert>
          )}
          <Box sx={{padding: 2}}>
              <Typography sx={{mt: 1}}>Vehicle Name: {vehicleName}</Typography>
              <Typography  sx={{mt: 1}}>Vehicle Number: {vehicleNumber}</Typography>
              <Typography  sx={{mt: 1}}>Total Time(hrs): {(new Date(departureDateTime)-new Date(arrivalDateTime))/(1000*60*60)}</Typography>
              <Typography  sx={{mt: 1}}>Total Price: {(new Date(departureDateTime)-new Date(arrivalDateTime))/(1000*60*60)*parkingArea.chargePerHour}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialog(false)}>Cancel</Button>
          <Button onClick={() => bookSlot()}>Make Payment</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default SlotCard