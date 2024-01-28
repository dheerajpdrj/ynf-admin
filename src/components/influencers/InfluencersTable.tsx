import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Stack,
  Avatar,
  Chip,
  Typography,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { palette } from "../../constants/colors";
import { tableInfluencersHeadings } from "../../constants/tableConstants";
import { doc } from "firebase/firestore";
import { firestore } from "../../firebase/firebaseConfig";

const InfluencersTable = (props: any) => {
  const {
    data,
    onEdit,
    onDelete,
    checkBox,
    selectedInfluencers,
    setSelectedInfluencers,
  } = props;

  const handleCheckboxToggle = (influencer: any) => {
    const selectedIndex = selectedInfluencers.findIndex(
      (selected: { id: any }) => selected.id === influencer.id
    );
    let newSelected = [...selectedInfluencers];

    if (selectedIndex === -1) {
      // Create a Firestore reference to the selected influencer
      const influencerRef = doc(firestore, "influencers", influencer.id);
      newSelected.push(influencerRef);
    } else {
      newSelected = newSelected.filter(
        (selected) => selected.id !== influencer.id
      );
    }

    setSelectedInfluencers(newSelected);
  };

  const getDisplayedCategories = (categories: string[]) => {
    return categories?.slice(0, 2);
  };

  const tableBodyStyles = {
    fontFamily: "Inter",
    fontSize: "14px",
    fontWeight: 400,
    fontStyle: "normal",
    lineHeight: "20px",
  };

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow sx={{ whiteSpace: "nowrap" }}>
            {checkBox ? (
              <TableCell
                sx={{
                  backgroundColor: palette.bgTableHeading,
                  color: palette.text.secondary,
                  fontFamily: "Inter",
                  fontSize: "12px",
                  fontWeight: 500,
                  fontStyle: "normal",
                  lineHeight: "18px",
                  whiteSpace: "nowrap",
                }}
              >
                <Checkbox
                  indeterminate={
                    selectedInfluencers?.length > 0 &&
                    selectedInfluencers?.length < data?.length
                  }
                  checked={selectedInfluencers?.length === data?.length}
                  onChange={() => {
                    if (selectedInfluencers?.length === data?.length) {
                      setSelectedInfluencers([]);
                    } else {
                      setSelectedInfluencers([...data]);
                    }
                  }}
                />
              </TableCell>
            ) : null}
            {tableInfluencersHeadings.map((heading) =>
              // Conditionally render the "Action" heading based on checkBox
              !checkBox || heading.label !== "Action" ? (
                <TableCell
                  key={heading.label}
                  sx={{
                    backgroundColor: palette.bgTableHeading,
                    color: palette.text.secondary,
                    fontFamily: "Inter",
                    fontSize: "12px",
                    fontWeight: 500,
                    fontStyle: "normal",
                    lineHeight: "18px",
                  }}
                >
                  {heading.label}
                </TableCell>
              ) : null
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.length === 0 ? ( // Check if data is empty
            <TableRow>
              <TableCell
                colSpan={
                  checkBox
                    ? tableInfluencersHeadings.length + 1
                    : tableInfluencersHeadings.length
                }
              >
                <Typography
                  variant="h4"
                  sx={{ textAlign: "center", color: palette.neutral500 }}
                >
                  No Data Found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            data?.map((item: any, index: number) => (
              <TableRow key={index}>
                {checkBox ? (
                  <TableCell>
                    <Checkbox
                      checked={selectedInfluencers?.some((selected: any) => {
                        return selected.id === item.id;
                      })}
                      onChange={() => handleCheckboxToggle(item)}
                    />
                  </TableCell>
                ) : null}
                <TableCell style={tableBodyStyles}>{index + 1}</TableCell>
                <TableCell style={tableBodyStyles}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {item.profile ? ( // If profilePic exists, show the Avatar
                      <Avatar alt={item.firstName} src={item.profile} />
                    ) : (
                      <Avatar
                        sx={{
                          bgcolor: palette.shades.orange.shade4,
                          color: palette.shades.blue.shade4,
                        }}
                      >
                        {item?.firstName.charAt(0)}
                        {item?.lastName.charAt(0)}
                      </Avatar>
                    )}
                    <span style={{ fontWeight: 500 }}>
                      {item.firstName} {item.lastName}
                    </span>
                  </Stack>
                </TableCell>
                <TableCell style={tableBodyStyles}>{item.email}</TableCell>
                <TableCell style={tableBodyStyles}>{item.mobile}</TableCell>
                <TableCell style={tableBodyStyles}>
                  <Stack direction="row" spacing={1}>
                    {getDisplayedCategories(item.categories)?.map(
                      (category: string, index: number) => (
                        <Chip
                          key={index}
                          label={category}
                          sx={{
                            backgroundColor: palette.primary,
                            color: palette.white,
                          }}
                        />
                      )
                    )}
                    {item?.categories?.length > 2 ? (
                      <Chip
                        label={`+${item?.categories?.length - 2}`}
                        sx={{
                          backgroundColor: palette.grey,
                          color: palette.white,
                        }}
                        // onClick={toggleShownCategories}
                      />
                    ) : null}
                  </Stack>
                </TableCell>
                <TableCell style={tableBodyStyles}>
                  {item.instagramFollowers}
                </TableCell>
                <TableCell style={tableBodyStyles}>
                  {item.facebookFollowers}
                </TableCell>
                <TableCell style={tableBodyStyles}>
                  {item.youtubeSubscribers}
                </TableCell>
                <TableCell style={tableBodyStyles}>
                  {item.twitterFollowers}
                </TableCell>
                <TableCell style={tableBodyStyles}>
                  <Chip
                    label={item.status === true ? "Active" : "Inactive"}
                    variant="filled"
                    sx={{
                      backgroundColor:
                        item.status === true
                          ? palette.successLight
                          : item.status === false
                          ? palette.errorLight
                          : null,
                      color:
                        item.status === true ? palette.success : palette.error,
                    }}
                  />
                </TableCell>
                {!checkBox ? (
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Delete
                        sx={{
                          color: palette.neutral500,
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          onDelete(item.id);
                        }}
                      />
                      <Edit
                        sx={{
                          color: palette.neutral500,
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          onEdit(item);
                        }}
                      />
                    </Stack>
                  </TableCell>
                ) : null}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InfluencersTable;
