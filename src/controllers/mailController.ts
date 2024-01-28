import { toast } from "react-toastify";
import { sendEmailCallable } from "../firebase/firebaseConfig";
import { encryptData } from "./encryptController";

export const sendEmailForInfluencer = async (
  influencer: any,
  influencerId: any
) => {
  // Generate a registration link for the influencer
  const encryptedData = encryptData({ ...influencer, influencerId });
  const encodedData = encodeURIComponent(encryptedData);
  const registrationLink = `${process.env.REACT_APP_BASE_INFLUENCER_URL}/register?data=${encodedData}`;

  // Send the email with the registration link
  const emailData = {
    email: influencer.email,
    registrationLink,
  };

  try {
    await sendEmailCallable(emailData);
  } catch (error) {
    console.error(`Error sending email to ${influencer.email}:`, error);
    toast.error(`Error sending email to ${influencer.email}`);
  }
};
