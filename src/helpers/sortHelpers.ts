// helpers/sortHelpers.js

// Generic sorting function
export function sortData(data: any, sortKey: any, direction: any, type?: any) {
  // Sort the data based on the "firstName" property in each influencer object
  function compareInfluencers(a: any, b: any) {
    let nameA: any = "";
    let nameB: any = "";
    if (sortKey === "taskName") {
      nameA = a.taskName.toUpperCase();
      nameB = b.taskName.toUpperCase();
    } else if (sortKey === "dueDate") {
      nameA = a.dueDate;
      nameB = b.dueDate;
    } else if (sortKey === "paymentStatus") {
      nameA = a.status;
      nameB = b.status;
    } else if (sortKey === "method") {
      nameA = a.paymentType;
      nameB = b.paymentType;
    } else if (sortKey === "influencers") {
      nameA = a.influencer?.firstName?.toUpperCase();
      nameB = b.influencer?.firstName?.toUpperCase();
    } else if (sortKey === "progress") {
      nameA = a.progress.toUpperCase();
      nameB = b.progress.toUpperCase();
    }
    return direction === "asc"
      ? nameA?.localeCompare(nameB)
      : nameB?.localeCompare(nameA);
  }
  if (type && sortKey === "influencers") {
    data.forEach((item: any) => {
      item?.projects?.forEach((project: any) => {
        project.influencersAssigned &&
          project.influencersAssigned.sort(compareInfluencers);
      });
    });
    return JSON.parse(JSON.stringify(data, null, 2));
  }
  if (
    type &&
    (sortKey === "taskName" ||
      sortKey === "dueDate" ||
      sortKey === "progress" ||
      sortKey === "paymentStatus" ||
      sortKey === "method")
  ) {
    data.forEach((item: any) => {
      item?.projects?.forEach((project: any) => {
        project.influencersAssigned &&
          project.influencersAssigned.forEach((influencerAssigned: any) => {
            influencerAssigned.tasks &&
              influencerAssigned.tasks.length &&
              influencerAssigned.tasks.sort(compareInfluencers);
          });
      });
    });
    return JSON.parse(JSON.stringify(data, null, 2));
  }
  // Now, your data is sorted by "firstName" in each "influencer" object within "influencersAssigned"

  return data.sort((a: any, b: any) => {
    if (sortKey === "brandName") {
      const nameA = a?.brandName.toLowerCase();
      const nameB = b?.brandName.toLowerCase();
      return direction === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    } else if (sortKey === "brand") {
      const brandNameA = a?.brand?.brandName.toLowerCase();
      const brandNameB = b?.brand?.brandName.toLowerCase();
      return direction === "asc"
        ? brandNameA.localeCompare(brandNameB)
        : brandNameB.localeCompare(brandNameA);
    } else if (sortKey === "spocName") {
      const nameA = `${a.spocFirstName} ${a.spocLastName}`.toLowerCase();
      const nameB = `${b.spocFirstName} ${b.spocLastName}`.toLowerCase();
      return direction === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    } else if (sortKey === "categories") {
      const nameA = (a.categories || []).length;
      const nameB = (b.categories || []).length;
      return direction === "asc" ? nameA - nameB : nameB - nameA;
    } else if (sortKey === "status") {
      const nameA = a.status;
      const nameB = b.status;
      return direction === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    } else {
      // Default sorting for other columns
      if (a[sortKey] < b[sortKey]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[sortKey] > b[sortKey]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    }
  });
}
