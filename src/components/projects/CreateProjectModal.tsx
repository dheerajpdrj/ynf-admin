import { CancelRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Step,
  StepButton,
  StepLabel,
  Stepper,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { palette } from "../../constants/colors";
import ProjectDetails from "./ProjectDetails";
import Sow from "./Sow";
import InfluencersTable from "../influencers/InfluencersTable";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProjects,
  saveProjectDetails,
  updateSavedProject,
} from "../../controllers/projectControllers";
import { fetchAllInfluencers } from "../../controllers/influencersController";
import { areAllFieldsFilled } from "../../services/validate.service";
import { addDoc, collection, doc } from "firebase/firestore";
import { firestore } from "../../firebase/firebaseConfig";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const CreateProjectModal = (props: any) => {
  const { closeModal, isModalOpen, editItem, setEditItem } = props;
  const isMediumScreen = useMediaQuery("(max-width: 600px)");
  const dispatch = useDispatch();
  const allInfluencers = useSelector(
    (state: any) => state.influencers.allInfluencers
  );

  const registeredInfluencers = allInfluencers.filter((influencer: any) => {
    return influencer.status === true;
  });

  const projectId = useSelector((state: any) => state.projects.projectId);

  // Array of step labels
  const steps = ["Project Details", "SOW", "Select Influencers"];

  // For project details the first step
  const [projectDetails, setProjectDetails] = useState({
    projectName: "",
    brand: null,
    dateOfCreation: "",
    status: "",
    subscription: "",
  });
  const [loading, setLoading] = useState(false);

  // For categories
  const [categories, setCategories] = useState<any>([]);
  const [categoryError, setCategoryError] = useState<any | null>(null);

  // For SOW Second step
  const [sow, setSow] = useState("");

  // For influencers Third step
  const [selectedInfluencers, setSelectedInfluencers] = useState<any[]>([]);

  // State to track if the form is submitted for error handling
  const [isSubmitted, setIsSubmitted] = useState(false);

  // State to track active step in the stepper
  const [activeStep, setActiveStep] = useState(0);

  const checkBox = true;

  const fieldsToCheck = [
    projectDetails.projectName,
    projectDetails.brand,
    projectDetails.dateOfCreation,
    projectDetails.status,
    projectDetails.subscription,
  ];

  const isAllFieldsFilled = areAllFieldsFilled(fieldsToCheck, categories);

  useEffect(() => {
    if (editItem.id) {
      setProjectDetails({
        projectName: editItem.projectName,
        brand: editItem?.brand?.id,
        dateOfCreation: editItem.dateOfCreation,
        status: editItem.status,
        subscription: editItem.subscription,
      });
      setCategories(editItem.categories);
      setSow(editItem.sow);
      const influencers = editItem?.influencersAssigned.map(
        (user: any) => user.influencer
      );
      setSelectedInfluencers(editItem?.influencersAssigned ? influencers : []);
    }
  }, [editItem]);

  useEffect(() => {
    const fetchInfleuncers = async () => {
      await fetchAllInfluencers(dispatch);
    };

    fetchInfleuncers();
  }, [dispatch]);

  const handleNext = async () => {
    const brandRef = projectDetails.brand
      ? doc(firestore, "brands/" + projectDetails.brand)
      : null;

    const influencerRefs = selectedInfluencers.map((influencer: any) =>
      doc(firestore, "influencers/" + influencer.id)
    );
    setLoading(true);
    if (activeStep === 0) {
      setIsSubmitted(true);
      // Check for category error
      if (categories.length === 0) {
        setCategoryError(true);
        setLoading(false);
        return;
      }
      if (isAllFieldsFilled) {
        try {
          const dataObj = {
            ...projectDetails,
            brand: brandRef,
            categories: categories,
          };
          const result = editItem.id
            ? await updateSavedProject(editItem.id, dataObj)
            : await saveProjectDetails(dataObj, dispatch);
          if (result === true) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setLoading(false);
          }
        } catch (error) {
          console.error("Error saving project details:", error);
        }
      } else {
        setLoading(false);
      }
    } else if (activeStep === 1) {
      if(sow) {  
      const result = await updateSavedProject(
        editItem.id ? editItem.id : projectId,
        { sow: sow }
      );
      if (result === true) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setLoading(false);
      }
    }else toast.error("Please enter SOW"); setLoading(false);
    } else if (activeStep === 2) {
      const dataObj = influencerRefs.map((influencerRef) => {
        return {
          influencer: influencerRef,
          assignedDate: dayjs().format("DD-MM-YYYY"),
        };
      });

      const influencerCollectionRef = collection(
        firestore,
        "influencersAssigned"
      );

      //add the influencer
      let iaRef: any = [];
      if (dataObj.length > 0) {
        iaRef = dataObj.map(async (ia: any) => {
          const newIA: any = await addDoc(influencerCollectionRef, ia);
          const influencersAssignRef = doc(
            firestore,
            "influencersAssigned/" + newIA.id
          );
          return influencersAssignRef;
        });
      }

      const result = await updateSavedProject(
        editItem.id ? editItem.id : projectId,
        { influencersAssigned: await Promise.all(await iaRef) }
      );
      if (result === true) {
        setLoading(false);
        closeModal();
        resetData();
      }
    }
    await fetchAllProjects(dispatch);
  };

  const stepStyle = {
    "& .MuiStepLabel-root .Mui-active": {
      color: palette.primary,
    },
  };

  const resetData = () => {
    setProjectDetails({
      projectName: "",
      brand: null,
      dateOfCreation: "",
      status: "",
      subscription: "",
    });
    setCategories([]);
    setIsSubmitted(false);
    setSow("");
    setSelectedInfluencers([]);
    setActiveStep(0);
    setEditItem({});
    setCategoryError(null);
  };

  return (
    <Dialog
      open={isModalOpen}
      onClose={() => {
        closeModal();
        resetData();
      }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        <IconButton
          onClick={() => {
            closeModal();
            resetData();
          }}
          sx={{
            fontSize: "2rem",
            color: palette.primary,
            cursor: "pointer",
            position: "absolute",
            right: 8,
            top: 8,
            zIndex: 1,
          }}
        >
          <CancelRounded />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};

            return (
              <Step key={label} {...stepProps} sx={stepStyle}>
                <StepButton onClick={() => setActiveStep(index)}>
                  <StepLabel>{label}</StepLabel>
                </StepButton>
              </Step>
            );
          })}
        </Stepper>

        {/* Step Content */}
        <Box>
          <div>
            {activeStep === 0 && (
              <div style={{ padding: isMediumScreen ? 0 : "0 5rem" }}>
                <ProjectDetails
                  setProjectDetails={setProjectDetails}
                  projectDetails={projectDetails}
                  categories={categories}
                  setCategories={setCategories}
                  isSubmitted={isSubmitted}
                  setIsSubmitted={setIsSubmitted}
                  categoryError={categoryError}
                  setCategoryError={setCategoryError}
                />
              </div>
            )}

            {/* For step 1 (SOW): */}
            {activeStep === 1 && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <Sow sow={sow} setSow={setSow} />
              </Box>
            )}

            {/* For step 2 (Select Influencers): */}
            {activeStep === 2 && (
              <Box
                sx={{
                  overflowX: "auto",
                  mt: 2,
                  mb: 1,
                  "::-webkit-scrollbar-track": {
                    borderRadius: "10px",
                    width: "4px",
                    backgroundColor: palette.neutral800,
                  },
                  "::-webkit-scrollbar-thumb": {
                    borderRadius: "10px",
                    backgroundColor: palette.neutral700,
                    width: "2px",
                  },
                }}
              >
                <InfluencersTable
                  checkBox={checkBox}
                  data={registeredInfluencers}
                  selectedInfluencers={selectedInfluencers}
                  setSelectedInfluencers={setSelectedInfluencers}
                />
              </Box>
            )}

            <DialogActions sx={{ justifyContent: "center" }}>
              <Grid item xs={12} sx={{ p: isMediumScreen ? 0 : "0 5rem" }}>
                <Button
                  onClick={handleNext}
                  variant="contained"
                  fullWidth
                  sx={{
                    textTransform: "none",
                    color: palette.white,
                  }}
                >
                  {loading && isSubmitted
                    ? "Loading"
                    : activeStep === steps.length - 1
                    ? editItem.id
                      ? "Update Project"
                      : "Create Project"
                    : "Save and Next"}
                </Button>
              </Grid>
            </DialogActions>
          </div>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
