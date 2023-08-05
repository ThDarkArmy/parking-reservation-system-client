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
import Snackbar from "../components/Snackbar";


import { useNavigate } from "react-router-dom";

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


const OwnerPanel = () => {
  const [parkingAreas, setParkingAreas] = useState([]);
  const [parkingAreaToDisplay, setParkingAreaToDisplay] = useState();
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [openEditForm, setOpenEditForm] = useState(false);
  const [openAddForm, setOpenAddForm] = useState(false);
  const [parkingAreaId, setParkingAreaId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [address, setAddress] = useState("");
  const [numberOfSlots, setNumberOfSlots] = useState();
  const [image, setImage] = useState(null);
  const [chargePerHour, setChargePerHour] = useState();

  const [showValidationError, setshowValidationError] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(()=> {
    if(!token){
      navigate("/login-register");
  }
    if(role==="ADMIN"){
      navigate("/admin-panel");
    }else if(role==="USER"){
      navigate("/");
    }
},[])

  useEffect(()=> {
      loadBookedSlots();
  }, [])

  useEffect(() => {
    loadParkingAreas();
  }, [])

  const loadParkingAreas = async () => {
    try {
      const response = await axios({
        method: "get",
        url: `${BASE_URL}/parkingarea/my-parking-area`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data) {
        setParkingAreas(response.data);
        setParkingAreaToDisplay(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const addParkingArea = async () => {
    if (address === "" || numberOfSlots == 0 || image === null || chargePerHour==="") {
      setshowValidationError(true);
    } else {
      const formData = new FormData();
      formData.append("address", address);
      formData.append("numberOfSlots", numberOfSlots);
      formData.append("image", image);
      formData.append("chargePerHour", chargePerHour);
      try {
        const response = await axios({
          method: "post",
          url: `${BASE_URL}/parkingarea/`,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.data) {
          loadParkingAreas();
          setSnackbarMessage("Parking area added successfully");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
          setOpenAddForm(false)
        }
      } catch (error) {
        setSnackbarMessage("Parking area could not be added.");
        setSnackbarSeverity("failed");
        setOpenSnackbar(true);
      }
    }

  }

  const deleteParkingArea = async (id) => {
    try {
      const response = await axios({
        method: "delete",
        url: `${BASE_URL}/parkingarea/${id}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response) {
        setSnackbarMessage("Parking area deleted successfully");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        loadParkingAreas();
      }
    } catch (error) {
      setSnackbarMessage("Parking area couldn't deleted");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }

  }

  const cancelSlot = async (id) => {
    try {
        const response = await axios({
            method: "delete",
            url: BASE_URL + "/bookparkingslot/" + id,
            headers: {
                "content-type": "application/json",
                Authorization: "Bearer " + token,
            }
        });

        if (response) {
            setOpenSnackbar(true);
            setSnackbarMessage("Parking slot cancelled successfully");
            setSnackbarSeverity("success");
            loadBookedSlots();
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
            url: BASE_URL + "/bookparkingslot/all",
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


  const editParkingArea = async () => {
    if (address === "" || numberOfSlots ==="" || chargePerHour==="") {
      setshowValidationError(true);
    } else {
      const data = JSON.stringify({ address, numberOfSlots, chargePerHour });
      try {
        const response = await axios({
          method: "put",
          url: `${BASE_URL}/parkingarea/update/${parkingAreaId}`,
          data: data,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.data) {
          loadParkingAreas();
          setOpenEditForm(false);
          setSnackbarMessage("Parking area upadted successfully");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
          loadParkingAreas();
        }
      } catch (error) {
        console.log(error);
        loadParkingAreas();
        setSnackbarMessage("Parking area could not be updated");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    }

  }


  const handleOpenEditForm = (parkingArea) => {
    setParkingAreaId(parkingArea.id);
    setAddress(parkingArea.address);
    setNumberOfSlots(parkingArea.numberOfSlots);
    setChargePerHour(parkingArea.chargePerHour);
    setOpenEditForm(true);
  };


  return (
    <div>
      <Header />
      <Box sx={{ mt: 8, maxWidth: "100%", padding: 2 }}>
        <Dialog open={openEditForm} onClose={() => setOpenEditForm(false)}>
          <DialogTitle>Edit Parking Area</DialogTitle>
          <DialogContent>
            {showValidationError && (
              <Alert severity="error">All the fields are mandatory</Alert>
            )}
            <TextField
              size="small"
              label="Address"
              fullWidth
              value={address}
              type="text"
              onChange={(e) => {
                setshowValidationError(false);
                setAddress(e.target.value);
              }}
              sx={{ mt: 2 }}
            />
            <TextField
              size="small"
              label="Number of Slots"
              fullWidth
              onChange={(e) => {
                setshowValidationError(false);
                setNumberOfSlots(e.target.value);
              }}
              type="number"
              value={numberOfSlots}
              sx={{ mt: 2 }}
            />
            <TextField
              size="small"
              label="Charge Per Hour"
              fullWidth
              type="number"
              onChange={(e) => {
                setshowValidationError(false);
                setChargePerHour(e.target.value);
              }}
              value={chargePerHour}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditForm(false)}>Cancel</Button>
            <Button onClick={editParkingArea}>Update</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openAddForm} onClose={() => setOpenAddForm(false)}>
          <DialogTitle>Add Parking Area</DialogTitle>
          <DialogContent>
            {showValidationError && (
              <Alert severity="error">All the fields are mandatory</Alert>
            )}

            <TextField
              size="small"
              label="Address"
              fullWidth
              value={address}
              type="text"
              onChange={(e) => {
                setshowValidationError(false);
                setAddress(e.target.value);
              }}
              sx={{ mt: 2 }}
            />
            <TextField
              size="small"
              label="Number of Slots"
              fullWidth
              type="number"
              onChange={(e) => {
                setshowValidationError(false);
                setNumberOfSlots(e.target.value);
              }}
              value={numberOfSlots}
              sx={{ mt: 2 }}
            />
            <TextField
              size="small"
              label="Charge Per Hour"
              fullWidth
              type="number"
              onChange={(e) => {
                setshowValidationError(false);
                setChargePerHour(e.target.value);
              }}
              value={chargePerHour}
              sx={{ mt: 2 }}
            />
            <TextField
              size="small"
              label="Image"
              fullWidth
              type="file"
              onChange={(e) => {
                setshowValidationError(false);
                setImage(e.target.files[0]);
              }}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddForm(false)}>Cancel</Button>
            <Button onClick={addParkingArea}>Add Parking Area</Button>
          </DialogActions>
        </Dialog>

        <Box display="flex">
          <Typography variant="h5" color="initial">
            Parking Areas
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            sx={{ ml: "auto" }}
            onClick={() => setOpenAddForm(true)}
          >
            Add Parking Area
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Parking Area (Id)</StyledTableCell>
                  <StyledTableCell align="right">Address</StyledTableCell>
                  <StyledTableCell align="right">Number of Slots</StyledTableCell>
                  <StyledTableCell align="right">Charge Per Hour</StyledTableCell>
                  <StyledTableCell align="right">
                    Image
                  </StyledTableCell>
                  <StyledTableCell align="right">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parkingAreas &&
                  parkingAreas.map((row) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell component="th" scope="row">
                        {row.id}
                      </StyledTableCell>
                      <StyledTableCell
                        align="right"
                        component="th"
                        scope="row"
                      >
                        {row.address}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.numberOfSlots}
                      </StyledTableCell>
                      <StyledTableCell align="right">{row.chargePerHour}</StyledTableCell>
                      <StyledTableCell align="right"><img height="25px" width="25px" src={row.imageUrl} /></StyledTableCell>
                      <StyledTableCell align="right">
                        <EditIcon
                          sx={{ cursor: "pointer" }}
                          onClick={() => handleOpenEditForm(row)}
                        />
                        <DeleteIcon
                          sx={{ cursor: "pointer", ml: 2 }}
                          onClick={() => deleteParkingArea(row.id)}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Snackbar snackbarSeverity={snackbarSeverity} snackbarMessage={snackbarMessage} openSnackbar={openSnackbar}  setOpenSnackbar={setOpenSnackbar}/>
      </Box>

      <Box sx={{mt: 5, padding: 2, mb: 20}}>
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

export default OwnerPanel