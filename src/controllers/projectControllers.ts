import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../firebase/firebaseConfig";
import { toast } from "react-toastify";
import { addProjectId, setProjects } from "../store/slice/projectSlice";

export const saveProjectDetails = async (
  projectDetails: any,
  dispatch: any
) => {
  try {
    const influencerCollectionRef = collection(firestore, "projects");
    const data = await addDoc(influencerCollectionRef, projectDetails);
    dispatch(addProjectId(data.id));
    toast.success("Project Created successfully");
    return true;
  } catch (error) {
    console.error(error);
    toast.error("Failed to add project details");
    return false;
  }
};

export const updateSavedProject = async (projectId: any, updateData: any) => {
  try {
    await updateDoc(doc(firestore, "projects", projectId), updateData);
    toast.success("Project updated successfully");
    return true;
  } catch (error) {
    console.error(error);
    toast.error("Failed to update project");
    return false;
  }
};

export const getProjectByBrand = async (brandId: any) => {
  try {
    const brandRef = doc(firestore, "brands", brandId);
    const prodjectCollectionRef = collection(firestore, "projects");

    // Query tasks where the brandRef is in the projects array
    const q = query(prodjectCollectionRef, where("brand", "==", brandRef));
    const querySnapshot = await getDocs(q);
    const projectsDataArray: any = querySnapshot.docs.map(
      async (projectDoc: any) => {
        const projectData: any = projectDoc.data();
        projectData.id = projectDoc.id;
        if (projectData?.influencersAssigned) {
          projectData.influencersAssigned = await Promise.all(
            projectData.influencersAssigned.map(
              async (influencerAssigned: any) => {
                const influencerDocSnapshot = await getDoc(influencerAssigned);

                if (influencerDocSnapshot.exists()) {
                  let influencerData: any = influencerDocSnapshot.data();
                  const inf: any = (
                    await getDoc(influencerData.influencer)
                  ).data();
                  return {
                    assignedDate: influencerData.assignedDate,
                    influencer: {
                      ...inf,
                      id: (await getDoc(influencerData.influencer)).id,
                    },
                  };
                }
                return null;
              }
            )
          );
        }
        const projectRef = doc(firestore, "projects", projectDoc.id);
        const taskCollectionRef = collection(firestore, "ynfTasks");
        const tq = query(taskCollectionRef, where("project", "==", projectRef));
        const tastQuerySnapshot = await getDocs(tq);
        if (tastQuerySnapshot?.docs) {
          projectData.tasks = await Promise.all(
            tastQuerySnapshot?.docs.map(
              async (taskDocs: any) => await taskDocs.data()
            )
          );
        }
        return projectData;
      }
    );
    return await Promise.all(projectsDataArray);
  } catch (error: any) {
    toast.error("Failed to get the project");
  }
};

export const getAllBrandsWithData = async () => {
  try {
    const brandsCollectionRef = collection(firestore, "brands");
    const querySnapshot = await getDocs(brandsCollectionRef);
    const brandWithData = querySnapshot.docs.map(async (brandDoc: any) => {
      const brandRef = doc(firestore, "brands", brandDoc.id);
      const prodjectCollectionRef = collection(firestore, "projects");

      // // Query tasks where the brandRef is in the projects array
      const q = query(prodjectCollectionRef, where("brand", "==", brandRef));
      const projectQuerySnapshot = await getDocs(q);
      const projectsDataArray: any = projectQuerySnapshot.docs.map(
        async (projectDoc: any) => {
          const projectData: any = projectDoc.data();
          if (projectData?.influencersAssigned) {
            projectData.influencersAssigned = await Promise.all(
              projectData.influencersAssigned.map(
                async (influencerAssigned: any) => {
                  const influencerDocSnapshot = await getDoc(
                    influencerAssigned
                  );

                  if (influencerDocSnapshot.exists()) {
                    let influencerData: any = influencerDocSnapshot.data();
                    const inf: any = (
                      await getDoc(influencerData.influencer)
                    ).data();
                    const infData: any = {
                      assignedDate: influencerData.assignedDate,
                      influencer: {
                        ...inf,
                        id: (await getDoc(influencerData.influencer)).id,
                      },
                    };
                    // querying task
                    // const projectRef = doc(firestore, "projects", projectDoc.id);
                    const taskCollectionRef = collection(firestore, "ynfTasks");
                    const tq = query(
                      taskCollectionRef,
                      where(
                        "influencer",
                        "==",
                        (await getDoc(influencerData.influencer)).ref
                      ),
                      where("project", "==", projectDoc.ref)
                    );
                    const tastQuerySnapshot = await getDocs(tq);
                    if (tastQuerySnapshot?.docs) {
                      infData.tasks = await Promise.all(
                        tastQuerySnapshot?.docs.map(async (taskDocs: any) => ({
                          ...(await taskDocs.data()),
                          taskId: await taskDocs.id,
                        }))
                      );
                    }
                    return infData;
                  }
                  return null;
                }
              )
            );
          }
          return projectData;
        }
      );
      return {
        id: brandDoc.id,
        ...brandDoc.data(),
        projects: await Promise.all(projectsDataArray),
      };
    });
    return await Promise.all(brandWithData); // Return the fetched data
  } catch (error: any) {
    toast.error("Failed to get the project");
  }
};
export const updateTask = async (taskId: any, updateData: any) => {
  try {
    await updateDoc(doc(firestore, "ynfTasks", taskId), updateData);
    toast.success("Updated Successfully");
  } catch (error) {
    console.error(error);
    toast.error("Failed to update task");
  }
};
export const fetchAllProjects = async (dispatch: any) => {
  try {
    const projectsCollectionRef = collection(firestore, "projects");
    const q = query(projectsCollectionRef, orderBy("dateOfCreation", "desc"));
    const querySnapshot = await getDocs(q);

    const projectsData = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const brand = data.brand ? (await getDoc(data.brand)).data() : null;
        const influencerAssignedArray = data.influencersAssigned || [];

        // Map influencerAssigned array to the desired format with influencer data
        const influencersAssigned = await Promise.all(
          influencerAssignedArray.map(async (influencerAssigned: any) => {
            const influencerDocSnapshot = await getDoc(influencerAssigned);

            if (influencerDocSnapshot.exists()) {
              let influencerData: any = influencerDocSnapshot.data();
              const inf: any = (await getDoc(influencerData.influencer)).data();
              return {
                assignedDate: influencerData.assignedDate,
                influencer: {
                  ...inf,
                  id: (await getDoc(influencerData.influencer)).id,
                },
              };
            }
            return null;
          })
        );

        return {
          id: doc.id,
          ...data,
          brand: brand ? { ...brand, id: data.brand.id } : null,
          influencersAssigned,
        };
      })
    );

    dispatch(setProjects(projectsData));
  } catch (error) {
    console.error(error);
  }
};
