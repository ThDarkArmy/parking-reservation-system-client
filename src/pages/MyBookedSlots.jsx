import React, { useState, useEffect } from "react";
import Header from "../components/Header";
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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiAlert from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { useNavigate } from "react-router-dom";
import SnackBar from "../components/Snackbar";

const BASE_URL = "http://localhost:8000/api/v1";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));


const MyBookedSlots = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const [openBookSlotForm, setOpenBookSlotForm] = useState(false);
    const [showValidationError, setshowValidationError] = useState(false);
    const [parkingSlotId, setParkingSlotId] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("");
    const [openEditForm, setOpenEditForm] = useState(false);
    const [vehicleName, setVehicleName] = useState("");
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [bookParkingSlotId, setBookParkingSlotId] = useState("");
    const [arrivalDateTime, setArrivalTime] = useState("");
    const [departureDateTime, setDepartureDateTime] = useState("");
    const [bookedSlots, setBookedSlots] = useState([]);

    useEffect(()=> {
        if(!token){
          navigate("/login-register");
      }
    },[])

    useEffect(()=> {
        loadBookedSlots();
    }, [])

    const updateSlot = async () => {
        if (
            arrivalDateTime === "" ||
            vehicleNumber === "" ||
            departureDateTime === "" ||
            vehicleName === ""
        ) {
            setshowValidationError(true);
        } else {
            const bookSlotdata = { arrivalDateTime, departureDateTime, vehicleName, vehicleNumber };
            try {
                const response = await axios({
                    method: "put",
                    url: BASE_URL + "/bookparkingslot/update-booking/"+bookParkingSlotId,
                    headers: {
                        "content-type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                    data: JSON.stringify(bookSlotdata)
                });

                if (response.data) {
                    setOpenSnackbar(true);
                    setSnackbarMessage("Parking slot updated successfully");
                    setSnackbarSeverity("success")
                    setArrivalTime("");
                    setDepartureDateTime("");
                    setVehicleNumber("");
                    setVehicleName("");
                    setParkingSlotId("");
                    setOpenEditForm(false);
                }
            } catch (err) {
                console.log(err);
                setOpenSnackbar(true);
                setSnackbarMessage("Some error occured while updating slot");
                setSnackbarSeverity("error")
            }
        }
    };

    const cancelSlot = async (id) => {
        try {
            const response = await axios({
                method: "delete",
                url: BASE_URL + "/bookparkingslot/update-booking/" + id,
                headers: {
                    "content-type": "application/json",
                    Authorization: "Bearer " + token,
                }
            });

            if (response) {
                setOpenSnackbar(true);
                setSnackbarMessage("Parking slot cancelled successfully");
                setSnackbarSeverity("success")
            }
        } catch (err) {
            console.log(err);
            setOpenSnackbar(true);
            setSnackbarMessage("Some error occured while cancelling slot");
            setSnackbarSeverity("error")
        }
    };

    const loadBookedSlots = async () => {
        try {
            const response = await axios({
                method: "get",
                url: BASE_URL + "/bookparkingslot/my-bookings",
                headers: {
                    "content-type": "application/json",
                    Authorization: "Bearer " + token,
                }
            });
            if (response.data) {
              setBookedSlots(response.data)
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleOpenEditForm = (parkingSlot) => {
        setBookParkingSlotId(parkingSlot.id);
        setArrivalTime(parkingSlot.arrivalDateTime);
        setDepartureDateTime(parkingSlot.departureDateTime);
        setVehicleName(parkingSlot.vehicleName);
        setVehicleNumber(parkingSlot.vehicleNumber);
        setOpenEditForm(true);
      };

    return (
        <div>
            <Header />
            <SnackBar snackbarSeverity={snackbarSeverity} snackbarMessage={snackbarMessage} openSnackbar={openSnackbar}  setOpenSnackbar={setOpenSnackbar}/>
            <Dialog open={openEditForm} onClose={() => setOpenEditForm(false)}>
                <DialogTitle>Book slot</DialogTitle>
                <DialogContent>
                    {showValidationError && (
                        <Alert severity="error">All the fields are mandatory</Alert>
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
                    <Button onClick={() => setOpenEditForm(false)}>Cancel</Button>
                    <Button onClick={() => updateSlot()}>Update Booking</Button>
                </DialogActions>
            </Dialog>
            <Box sx={{mt: 12, padding: 2, mb: 20}}>
            <Box display="flex">
          <Typography variant="h5" color="initial">
            Booked Slots
          </Typography>
        </Box>
        <Box sx={{ mt: 2, mb: 20 }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Booking (Id)</StyledTableCell>
                  <StyledTableCell align="right">Vehicle Name</StyledTableCell>
                  <StyledTableCell align="right">Vehicle Number</StyledTableCell>
                  <StyledTableCell align="right">Arrival Time</StyledTableCell>
                  <StyledTableCell align="right">
                    Departure Time
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    Total Price
                  </StyledTableCell>
                  <StyledTableCell align="right">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookedSlots &&
                  bookedSlots.map((row) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell component="th" scope="row">
                        {row.id}
                      </StyledTableCell>
                      <StyledTableCell
                        align="right"
                        component="th"
                        scope="row"
                      >
                        {row.vehicleName}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.vehicleNumber}
                      </StyledTableCell>
                      <StyledTableCell align="right">{row.arrivalDateTime}</StyledTableCell>
                      <StyledTableCell align="right">{row.departureDateTime}</StyledTableCell>
                      <StyledTableCell align="right">{row.totalPrice}</StyledTableCell>
                      <StyledTableCell align="right">
                        <EditIcon
                          sx={{ cursor: "pointer" }}
                          onClick={() => handleOpenEditForm(row)}
                        />
                        <DeleteIcon
                        title="Cancel Booking"
                          sx={{ cursor: "pointer", ml: 2 }}
                          onClick={() => cancelSlot(row.id)}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        </Box>

        </div>
    )
}

export default MyBookedSlots