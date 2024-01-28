import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase/firebaseConfig";

export const fetchBrandsData = async () => {
  const brandsCollectionRef = collection(firestore, "brands");
  const querySnapshot = await getDocs(brandsCollectionRef);
  const brandsDataArray: any = [];
  querySnapshot.forEach((doc) => {
    brandsDataArray.push({ id: doc.id, ...doc.data() });
  });

  return brandsDataArray; // Return the fetched data
};
