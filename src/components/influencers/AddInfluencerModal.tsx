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
import {
  addInfluencer,
  fetchAllInfluencers,
} from "../../controllers/influencersController";
import { useDispatch } from "react-redux";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";
import {
  areAllFieldsFilled,
  isEmailValid,
} from "../../services/validate.service";
import TagsInput from "../Toolbar/TagsInput";
import { sendEmailForInfluencer } from "../../controllers/mailController";

const AddInfluencerModal = (props: any) => {
  const { closeModal, isModalOpen, editItem } = props;
  const isMediumScreen = useMediaQuery("(max-width: 600px)");
  const dispatch = useDispatch();
  const [influencerData, setInfluencerData] = React.useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    instagramFollowers: "",
    facebookFollowers: "",
    youtubeSubscribers: "",
    twitterFollowers: "",
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [categories, setCategories] = useState<any>([]);
  const [emailError, setEmailError] = useState(false);
  const [categoryError, setCategoryError] = useState<any | null>(null);
  const [mobileError, setMobileError] = useState<any | null>(null);

  useEffect(() => {
    if (editItem?.id) {
      setInfluencerData({
        firstName: editItem.firstName,
        lastName: editItem.lastName,
        mobile: editItem.mobile,
        email: editItem.email,
        instagramFollowers: editItem.instagramFollowers,
        facebookFollowers: editItem.facebookFollowers,
        youtubeSubscribers: editItem.youtubeSubscribers,
        twitterFollowers: editItem.twitterFollowers,
      });
      setCategories(editItem.categories);
    }
  }, [editItem]);

  const onInfluencerDataChange = (event: any) => {
    const { name, value } = event.target;

    let updatedValue = value;

    if (name === "mobile") {
      setMobileError(false);
      updatedValue = value.slice(0, 10);
    }

    if (name === "email") {
      // Validate email format
      if (!isEmailValid(value)) {
        setEmailError(true);
      } else {
        setEmailError(false);
      }
    }
    setInfluencerData((prevState) => ({
      ...prevState,
      [name]: updatedValue,
    }));
  };

  const fieldsToCheck = [
    influencerData.firstName,
    influencerData.lastName,
    influencerData.mobile,
    influencerData.email,
    influencerData.instagramFollowers,
    influencerData.facebookFollowers,
    influencerData.youtubeSubscribers,
    influencerData.twitterFollowers,
  ];

  const isAllFieldsFilled = areAllFieldsFilled(fieldsToCheck, categories);

  const addInfluencerAndSendMail = async () => {
    setIsSubmitted(true);
    // Check for category error
    if (categories.length === 0) {
      setCategoryError(true);
      return;
    }
    if (influencerData.mobile.length !== 10) {
      setMobileError(true);
      return;
    } else {
      setMobileError(false);
    }
    if (isAllFieldsFilled && !emailError) {
      const dataObj = {
        ...influencerData,
        categories,
        status: false,
      };

      try {
        setLoading(true);
        const result = await addInfluencer(dataObj);

        if (result.success) {
          // After adding the influencer successfully, send the email
          await sendEmailForInfluencer(dataObj, result.id);
          setIsSubmitted(false);
          toast.success(result.message);
          setLoading(false);
          await fetchAllInfluencers(dispatch);
          closeModal();
        } else {
          setIsSubmitted(false);
          toast.error(result.message);
          setLoading(false);
        }
      } catch (error) {
        setIsSubmitted(false);
        console.error("Error adding influencer:", error);
        setLoading(false);
        toast.error("Error adding influencer");
      }
    }
  };

  const updateInfluencer = async () => {
    setIsSubmitted(true);
    // Check for category error
    if (categories.length === 0) {
      setCategoryError(true);
      return;
    }
    if (influencerData?.mobile.length !== 10) {
      setMobileError(true);
      return;
    } else {
      setMobileError(false);
    }

    if (isAllFieldsFilled && !emailError) {
      try {
        const influencerCollectionRef = collection(firestore, "influencers");
        const emailQuery = query(
          influencerCollectionRef,
          where("email", "==", influencerData.email)
        );
        const emailQuerySnapshot = await getDocs(emailQuery);

        if (!emailQuerySnapshot.empty) {
          if (
            emailQuerySnapshot.docs.filter(
              (item: any) => item.id !== editItem.id
            ).length > 0
          ) {
            toast.error("Email already exists");
            return;
          }
        }
        setLoading(true);

        // Update influencer data
        const dataObj = {
          ...influencerData,
          categories: categories,
        };
        await updateDoc(doc(firestore, "influencers", editItem.id), {
          ...dataObj,
        });
        if (editItem.status === false && editItem.email !== dataObj.email) {
          // Send email only if the influencer is not registered
          await sendEmailForInfluencer(dataObj, editItem.id);
        }
        await fetchAllInfluencers(dispatch);
        toast.success("Influencer updated successfully");
        setLoading(false);
        closeModal();
      } catch (error) {
        console.error("Error updating document:", error);
        setLoading(false);
        toast.error("Error updating document");
      }
    }
  };

  return (
    <Dialog
      open={isModalOpen}
      onClose={() => {
        closeModal();
        setIsSubmitted(false);
      }}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>
        <IconButton
          onClick={() => {
            closeModal();
            setIsSubmitted(false);
          }}
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
              First Name*
            </Typography>
            <TextField
              value={influencerData.firstName}
              onChange={onInfluencerDataChange}
              error={isSubmitted && !influencerData.firstName}
              name="firstName"
              placeholder="Enter First name"
              type="text"
              size="small"
              fullWidth
              inputProps={{ maxLength: 40 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Last Name*
            </Typography>
            <TextField
              value={influencerData.lastName}
              onChange={onInfluencerDataChange}
              error={isSubmitted && !influencerData.lastName}
              name="lastName"
              placeholder="Enter Last name"
              type="text"
              size="small"
              fullWidth
              inputProps={{ maxLength: 40 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Mobile Number*
            </Typography>
            <TextField
              value={influencerData.mobile}
              onChange={onInfluencerDataChange}
              error={isSubmitted && (!influencerData.mobile || mobileError)}
              helperText={
                isSubmitted && mobileError ? "Please enter a valid mobile" : ""
              }
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
              value={influencerData.email}
              onChange={onInfluencerDataChange}
              error={isSubmitted && (!influencerData.email || emailError)}
              helperText={
                isSubmitted && emailError ? "Please enter a valid email" : ""
              }
              name="email"
              placeholder="Enter Email Id"
              type="email"
              size="small"
              fullWidth
              disabled={editItem.status === true}
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
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Instagram Followers*
            </Typography>
            <TextField
              value={influencerData.instagramFollowers}
              onChange={onInfluencerDataChange}
              error={isSubmitted && !influencerData.instagramFollowers}
              name="instagramFollowers"
              placeholder="Enter Followers"
              type="text"
              size="small"
              fullWidth
              inputProps={{ maxLength: 10 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Facebook Followers*
            </Typography>
            <TextField
              value={influencerData.facebookFollowers}
              onChange={onInfluencerDataChange}
              error={isSubmitted && !influencerData.facebookFollowers}
              name="facebookFollowers"
              placeholder="Enter Followers"
              type="text"
              size="small"
              fullWidth
              inputProps={{ maxLength: 10 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Youtube Subscribers*
            </Typography>
            <TextField
              value={influencerData.youtubeSubscribers}
              onChange={onInfluencerDataChange}
              error={isSubmitted && !influencerData.youtubeSubscribers}
              name="youtubeSubscribers"
              placeholder="Enter Subscribers"
              type="text"
              size="small"
              fullWidth
              inputProps={{ maxLength: 10 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Twitter Followers*
            </Typography>
            <TextField
              value={influencerData.twitterFollowers}
              onChange={onInfluencerDataChange}
              error={isSubmitted && !influencerData.twitterFollowers}
              name="twitterFollowers"
              placeholder="Enter Followers"
              type="text"
              size="small"
              fullWidth
              inputProps={{ maxLength: 10 }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{ justifyContent: "center", padding: "0rem 3rem 2rem" }}
      >
        <Grid item xs={12} sx={{ textAlign: "center", width: "100%" }}>
          <Button
            variant={isAllFieldsFilled ? "contained" : "outlined"}
            fullWidth
            onClick={editItem.id ? updateInfluencer : addInfluencerAndSendMail}
            sx={{
              textTransform: "none",
              color: isAllFieldsFilled ? "white" : palette.primary,
            }}
          >
            {loading
              ? "Loading"
              : editItem.id
              ? "Submit"
              : "Add & Send Email Invitation"}
          </Button>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default AddInfluencerModal;
