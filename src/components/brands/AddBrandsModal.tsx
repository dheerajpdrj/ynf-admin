import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Grid,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { CancelRounded } from "@mui/icons-material";
import { palette } from "../../constants/colors";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import { setBrands } from "../../store/slice/brandsSlice";
import {
  areAllFieldsFilled,
  isEmailValid,
} from "../../services/validate.service";
import TagsInput from "../Toolbar/TagsInput";
import { toast } from "react-toastify";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

const AddBrandsModal = (props: any) => {
  const { closeModal, isModalOpen, editItem } = props;
  const isMediumScreen = useMediaQuery("(max-width: 600px)");
  const allBrands = useSelector((state: any) => state.brands.allBrands);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [brandData, setBrandData] = React.useState({
    spocFirstName: "",
    spocLastName: "",
    brandName: "",
    mobile: "",
    email: "",
    dateOfJoining: "",
  });

  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [categories, setCategories] = useState<any>([]);
  const [emailError, setEmailError] = useState(false);
  const [categoryError, setCategoryError] = useState<any | null>(null);

  useEffect(() => {
    if (editItem?.id) {
      setBrandData({
        spocFirstName: editItem.spocFirstName,
        spocLastName: editItem.spocLastName,
        brandName: editItem.brandName,
        mobile: editItem.mobile,
        email: editItem.email,
        dateOfJoining: editItem.dateOfJoining,
      });
      setCategories(editItem.categories);
    }
  }, [editItem]);

  const onBrandDataChange = (event: any) => {
    const { name, value } = event.target;

    let updatedValue = value;

    if (name === "mobile") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
    } else if (name === "email") {
      // Validate email format
      if (!isEmailValid(value)) {
        setEmailError(true);
      } else {
        setEmailError(false);
      }
    } else if (value?.length > 40) {
      updatedValue = value.slice(0, 40);
    }
    setBrandData((prevState) => ({
      ...prevState,
      [name]: updatedValue,
    }));
  };

  const fieldsToCheck = [
    brandData.spocFirstName,
    brandData.spocLastName,
    brandData.brandName,
    brandData.mobile,
    brandData.email,
    brandData.dateOfJoining,
  ];

  const isAllFieldsFilled = areAllFieldsFilled(fieldsToCheck, categories);

  const addBrand = async () => {
    setIsSubmitted(true);
    // Check for category error
    if (categories.length === 0) {
      setCategoryError(true);
      return;
    }
    if (isAllFieldsFilled && !emailError) {
      try {
        // Add brand data
        setLoading(true);
        let dataObj = {
          ...brandData,
          categories: categories,
        };

        const docRef = await addDoc(collection(firestore, "brands"), {
          ...dataObj,
        });
        dispatch(setBrands([...allBrands, { ...dataObj, id: docRef.id }]));
        setLoading(false);
        toast.success("Brand added successfully");
        closeModal();
      } catch (error) {
        toast.error("Failed to add");
        console.error("Error adding document: ", error);
      }
    }
  };

  const updateBrand = async () => {
    setIsSubmitted(true);

    if (isAllFieldsFilled && !emailError) {
      // Check for category error
      if (categories.length === 0) {
        setCategoryError(true);
        return;
      }

      try {
        // Update brand data
        setLoading(true);
        const dataObj = {
          ...brandData,
          categories: categories,
        };

        await updateDoc(doc(firestore, "brands", editItem.id), {
          ...dataObj,
        });
        // Update the redux store with the new brand data
        const updatedBrand = {
          id: editItem.id,
          ...dataObj,
        };
        const updatedBrandsData = allBrands.map((brand: any) =>
          brand.id === editItem.id ? updatedBrand : brand
        );

        dispatch(setBrands(updatedBrandsData));
        toast.success("Brand updated successfully");
        setLoading(false);
        closeModal();
      } catch (error) {
        console.error("Error updating document:", error);
        toast.error("Error while updating document");
      }
    }
  };

  return (
    <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="xs">
      <DialogTitle>
        <IconButton
          onClick={closeModal}
          sx={{
            fontSize: "2rem",
            color: palette.primary,
            cursor: "pointer",
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CancelRounded />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ padding: isMediumScreen ? 0 : 3 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              SPOC First Name*
            </Typography>
            <TextField
              value={brandData.spocFirstName}
              onChange={onBrandDataChange}
              error={isSubmitted && !brandData.spocFirstName}
              name="spocFirstName"
              placeholder="Enter First name"
              type="text"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              SPOC Last Name*
            </Typography>
            <TextField
              value={brandData.spocLastName}
              onChange={onBrandDataChange}
              error={isSubmitted && !brandData.spocLastName}
              name="spocLastName"
              placeholder="Enter Last name"
              type="text"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Brand Name*
            </Typography>
            <TextField
              value={brandData.brandName}
              onChange={onBrandDataChange}
              error={isSubmitted && !brandData.brandName}
              name="brandName"
              placeholder="Enter Brand name"
              type="text"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Mobile Number*
            </Typography>
            <TextField
              value={brandData.mobile}
              onChange={onBrandDataChange}
              error={isSubmitted && !brandData.mobile}
              name="mobile"
              placeholder="Enter Mobile number"
              type="number"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Email ID*
            </Typography>
            <TextField
              value={brandData.email}
              onChange={onBrandDataChange}
              error={isSubmitted && (!brandData.email || emailError)}
              name="email"
              placeholder="Enter Email Id"
              type="email"
              size="small"
              fullWidth
              helperText={
                isSubmitted && emailError ? "Please enter a valid email" : ""
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Category*
            </Typography>
            <TagsInput
              tags={categories}
              setTags={setCategories}
              error={categoryError}
              setError={setCategoryError}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Date Of Joining*
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={{ width: "100%" }}
                format="DD-MM-YYYY"
                slotProps={{
                  textField: {
                    InputProps: {
                      placeholder: "Date Of Joining*",
                      error: isSubmitted && !brandData.dateOfJoining,
                      size: "small",
                      fullWidth: true,
                      sx: {
                        color: brandData.dateOfJoining
                          ? palette.shades.black
                          : palette.placeHolder,
                      },
                    },
                  },
                }}
                value={dayjs(brandData.dateOfJoining, "DD-MM-YYYY") || null}
                onChange={(newValue) => {
                  setBrandData((prevState) => ({
                    ...prevState,
                    dateOfJoining: newValue
                      ? newValue.format("DD-MM-YYYY")
                      : "",
                  }));
                }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{ justifyContent: "center", padding: "0rem 3rem 2rem" }}
      >
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Button
            onClick={editItem.id ? updateBrand : addBrand}
            variant={isAllFieldsFilled ? "contained" : "outlined"}
            fullWidth
            sx={{
              textTransform: "none",
              color: isAllFieldsFilled ? "white" : palette.primary,
            }}
          >
            {loading ? "Loading" : editItem.id ? "Update Brand" : "Add Brand"}
          </Button>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default AddBrandsModal;
