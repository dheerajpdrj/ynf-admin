import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { deleteUserById, firestore } from "../firebase/firebaseConfig";
import { setInfluencers } from "../store/slice/influencersSlice";
import { toast } from "react-toastify";
import { sendEmailForInfluencer } from "./mailController";

// Modify addInfluencer function to return a message and status code
export const addInfluencer = async (influencer: any) => {
  try {
    const influencerCollectionRef = collection(firestore, "influencers");

    // Check if the email already exists
    const emailQuery = query(
      influencerCollectionRef,
      where("email", "==", influencer.email)
    );
    const emailQuerySnapshot = await getDocs(emailQuery);

    if (!emailQuerySnapshot.empty) {
      return { success: false, message: "Email already exists" };
    }

    // If email doesn't exist, add the influencer
    const data = await addDoc(influencerCollectionRef, influencer);

    return {
      id: data.id,
      success: true,
      message: "Influencer added successfully",
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to add influencer" };
  }
};

// Modify addBulkInfluencers function to return a message and status code
export const addBulkInfluencers = async (bulkData: any) => {
  const addedInfluencers = [];
  const errors = [];

  for (const influencerArray of bulkData) {
    // Skip the first array (headers)
    if (influencerArray === bulkData[0]) {
      continue;
    }

    // Split the categories by commas and trim each category
    const categories = influencerArray[4]
      .toString()
      .split(",")
      .map((category: any) => category.trim());

    // Transform the array into an influencer object
    const influencer = {
      firstName: influencerArray[0],
      lastName: influencerArray[1],
      email: influencerArray[2],
      mobile: influencerArray[3],
      instagramFollowers: influencerArray[5],
      facebookFollowers: influencerArray[6],
      youtubeSubscribers: influencerArray[7],
      twitterFollowers: influencerArray[8],
      categories: categories,
      status: false,
    };

    const result = await addInfluencer(influencer);
    if (result.success) {
      addedInfluencers.push(influencer);

      // Send an email for the added influencer
      await sendEmailForInfluencer(influencer, result.id);
    } else {
      errors.push(`${result.message} ${influencer.email}`);
    }
  }

  // Show a single toast for all errors, if any
  if (errors.length > 0) {
    errors.forEach((error) => {
      toast.error(error);
    });
  }

  return addedInfluencers;
};

export const fetchAllInfluencers = async (dispatch: any) => {
  try {
    const influencersCollectionRef = collection(firestore, "influencers");
    const querySnapshot = await getDocs(influencersCollectionRef);
    const influencersDataArray: any = [];
    querySnapshot.forEach((doc) => {
      influencersDataArray.push({ id: doc.id, ...doc.data() });
    });
    dispatch(setInfluencers(influencersDataArray));
  } catch (error) {
    console.error(error);
  }
};

export const deleteInfluencer = async (id: string) => {
  try {
    const influencerDocRef = doc(firestore, "influencers", id);
    await deleteDoc(influencerDocRef);
    await deleteUserById(id);
    toast.success("Influencer deleted successfully");
    return true;
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete influencer");
    return false;
  }
};
