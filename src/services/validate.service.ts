export const areAllFieldsFilled = (fields: any, categories: any) => {
  for (const field of fields) {
    if (!field) {
      return false; // If any field is empty, return false
    }
  }
  if (categories && categories?.length === 0) {
    return false; // If the array field is empty, return false
  }
  return true; // All fields are filled
};

export const isEmailValid = (email: any) => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
  return emailRegex.test(email);
};

export const isMobileValid = (mobile: any) => {
  const mobileRegex = /^\d{10}$/;
  return mobileRegex.test(mobile);
};

// Validations for the Number input field

export const validateInput = (inputValue: any, maxLength: number) => {
  const regex = /^\d*\.?\d{0,2}$/;
  const digitsBeforeDecimal = inputValue.split(".")[0];

  // Check if the input matches the format and total length (before decimal) is <= maxLength
  return regex.test(inputValue) && digitsBeforeDecimal.length <= maxLength;
};

// Validations for the BULK INFLUENCER SECTION for checking the uploaded CSV OR XLSX FILE
export const validateData = (parsedData: any[]) => {
  const requiredFields = [
    "First Name",
    "Last Name",
    "Email Address",
    "Mobile Number",
    "Category",
    "Instagram",
    "Facebook",
    "Youtube",
    "Twitter",
  ];

  // Trim the header row
  const headerRow = parsedData[0]?.map((value: any) => String(value).trim());

  const emailColumnIndex = headerRow.indexOf("Email Address");
  const emailSet = new Set<string>();
  const errors: string[] = [];

  if (parsedData?.length <= 1) {
    // CSV is empty or contains only headers
    errors.push("CSV is empty or missing data.");
    return errors;
  }

  for (let rowIndex = 1; rowIndex < parsedData?.length; rowIndex++) {
    const row = parsedData[rowIndex];

    const missingFields: string[] = [];
    requiredFields?.forEach((fieldName) => {
      const columnIndex = headerRow.indexOf(fieldName);
      if (
        columnIndex === -1 ||
        !row[columnIndex] ||
        (typeof row[columnIndex] === "string" &&
          row[columnIndex]?.trim() === "")
      ) {
        missingFields.push(fieldName);
      }
    });

    if (missingFields?.length > 0) {
      errors.push(
        `Row ${rowIndex + 1}: ${missingFields?.join(", ")} is required.`
      );
    }

    // Check for duplicate emails
    if (emailColumnIndex !== -1 && row[emailColumnIndex] !== undefined) {
      const email = row[emailColumnIndex];
      if (emailSet?.has(email)) {
        errors.push(`Row ${rowIndex + 1}: Duplicate email: ${email}`);
      } else if (!isEmailValid(email)) {
        errors.push(`Row ${rowIndex + 1}: Invalid email: ${email}`);
      } else {
        emailSet.add(email);
      }
    }

    // Check if mobile number is valid and has a maximum length of 10
    const mobileColumnIndex = headerRow.indexOf("Mobile Number");
    if (mobileColumnIndex !== -1 && row[mobileColumnIndex] !== undefined) {
      const mobile = row[mobileColumnIndex];
      if (mobile.length !== 10 || !isMobileValid(mobile)) {
        errors.push(`Row ${rowIndex + 1}: Invalid mobile number: ${mobile}`);
      }
    }

    const categoryColumnIndex = headerRow.indexOf("Category");
    if (categoryColumnIndex !== -1) {
      const categoryValue = row[categoryColumnIndex];
      if (typeof categoryValue === "string") {
        const categories = categoryValue
          .split(",")
          .map((category: any) => category.trim());
        for (const category of categories) {
          if (category.length > 14) {
            errors.push(
              `Row ${
                rowIndex + 1
              }: Category "${category}" exceeds 14 characters.`
            );
          }
        }
      }
    }

    // Check if "Name" has a maximum length of 40 characters
    const firstNameColumnIndex = headerRow.indexOf("First Name");
    const lastNameColumnIndex = headerRow.indexOf("Last Name");
    if (
      firstNameColumnIndex !== -1 &&
      lastNameColumnIndex !== -1 &&
      row[firstNameColumnIndex] !== undefined &&
      row[lastNameColumnIndex] !== undefined
    ) {
      const firstName = row[firstNameColumnIndex];
      const lastName = row[lastNameColumnIndex];
      if (firstName.length > 40 || lastName.length > 40) {
        errors.push(
          `Row ${
            rowIndex + 1
          }: First name and last name cannot exceed 40 characters.`
        );
      }
    }
  }

  return errors;
};
