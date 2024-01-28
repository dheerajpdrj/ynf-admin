import { HelpOutline } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { palette } from "../../constants/colors";
import { updateUserProfile } from "../../controllers/authController";
import { loggedIn } from "../../store/slice/authSlice";

const PersonalInformation = (props: any) => {
  const { admin } = props;
  const dispatch = useDispatch();
  const isMediumScreen = useMediaQuery("(max-width: 600px)");
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [firstName, setFirstName] = React.useState(admin?.first_name);
  const [lastName, setLastName] = React.useState(admin?.last_name);
  const [fNameError, setFNameError] = React.useState(false);
  const [lNameError, setLNameError] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [loading, setLoading] = useState(false);


  const handleImageSelect = async (e: any) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setSelectedImage(selectedFile);
    }
  };

  const toggleEdit = () => {
    setIsEditMode((prev) => !prev);
  };

  const handleSubmit = async () => {
    if (!firstName || !lastName) {
      if (!firstName) {
        setFNameError(true);
      }
      if (!lastName) {
        setLNameError(true);
      }
      return;
    }

    if (firstName.length > 40 || lastName.length > 40) {
      toast.error("First name and last name must be at most 40 characters");
      return;
    }
    let imageURL = admin?.profile_image;

    if (selectedImage) {
      const storage = getStorage();
      const storageRef = ref(
        storage,
        `profile_image/${admin?.id}/${selectedImage?.name}`
      );

      try {
        await uploadBytes(storageRef, selectedImage);
        imageURL = await getDownloadURL(storageRef);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    try {
      setLoading(true)

      await updateUserProfile(admin?.id, firstName, lastName, imageURL || "");

      // Update the auth.admin state with the new data
      const updatedAdminData = {
        ...admin,
        first_name: firstName,
        last_name: lastName,
        profile_image: imageURL || admin?.profile_image,
      };
      dispatch(loggedIn(updatedAdminData));
      toast.success("Profile updated successfully!");
      setLoading(false)
      setFNameError(false);
      setLNameError(false);
      setIsEditMode(false);
    } catch (error) {
      setLoading(false)
      console.error("Error updating user profile:", error);
      toast.error("Error updating profile!");
    }
  };

  return (
    <>
      <Box sx={{ p: 2 }}>
        {/* Profile Picture */}
        <label htmlFor="avatar-upload">
          <Avatar
            sx={{
              width: 94,
              height: 94,
              flexShrink: 0,
              margin: isMediumScreen ? "0 auto" : "",
              cursor: "pointer",
              border: `2px solid ${palette.primary}`,
            }}
            alt="Profile Image"
            src={
              selectedImage
                ? URL.createObjectURL(selectedImage)
                : admin?.profile_image
            }
          />
        </label>
        {isEditMode && <input
          id="avatar-upload"
          type="file"
          accept="image/png, image/gif, image/jpeg"
          style={{ display: "none" }}
          onChange={handleImageSelect}
        />}
        {/* First Name */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isMediumScreen ? "column" : "row",
            gap: isMediumScreen ? "0" : "1rem",
            mt: 3,
          }}
        >
          <Box
            sx={{
              width: "100%",
              marginBottom: isMediumScreen ? "1rem" : "0",
            }}
          >
            <Typography variant="h6" sx={{ lineHeight: ".43" }}>
              First Name
            </Typography>
            <TextField
              placeholder="First Name"
              variant="outlined"
              disabled={!isEditMode}
              value={firstName}
              error={fNameError}
              helperText={fNameError ? "First name is required" : ""}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              margin="normal"
              size="small"
            />
          </Box>
          <Box sx={{ width: "100%" }}>
            <Typography variant="h6" sx={{ lineHeight: ".43" }}>
              Last Name
            </Typography>
            <TextField
              placeholder="Last Name"
              variant="outlined"
              disabled={!isEditMode}
              value={lastName}
              error={lNameError}
              helperText={lNameError ? "Last name is required" : ""}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              margin="normal"
              size="small"
            />
          </Box>
        </Box>
        {/* Email */}
        <Typography variant="h6" sx={{ mt: 2, lineHeight: ".43" }}>
          Email
        </Typography>
        <TextField
          placeholder={admin?.email ? "" : "Email"}
          variant="outlined"
          value={admin?.email}
          fullWidth
          margin="normal"
          size="small"
          disabled
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end">
                  <HelpOutline sx={{ color: palette.primary }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ p: 4 }}>
          <Button
            variant="contained"
            sx={{ color: "white", textTransform: "none" }}
            fullWidth
            onClick={!isEditMode ? toggleEdit : handleSubmit}
          >
            {loading ? 'Loading': (isEditMode ? "Save" : "Edit Information")}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default PersonalInformation;

