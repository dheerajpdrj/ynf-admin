import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  Stack,
  Chip,
  Avatar,
  AvatarGroup,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { Edit, FilterList } from "@mui/icons-material";
import { palette } from "../../constants/colors";
import { sortData } from "../../helpers/sortHelpers";
import SowDetailsModal from "../projects/SowDetailsModal";

const GenericTable = (props: any) => {
  const { headings, data, onEdit, handleStatusChange } = props;

  const [sortConfig, setSortConfig] = useState<any>({
    key: "",
    direction: "",
  });
  const [selectedSow, setSelectedSow] = useState(null);
  const [isSowModalOpen, setSowModalOpen] = useState(false);
  const [isRotate, setIsRotate] = useState(false);

  const handleSort = (key: any, sortKey: string) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction, sortKey }); // Pass the correct sortKey here
  };

  const handleSowClick = (sow: any) => {
    setSelectedSow(sow);
    setSowModalOpen(true);
  };

  const getDisplayedCategories = (categories: string[]) => {
    return categories.slice(0, 2);
  };

  const getSortedData = () => {
    let sortedData = [...data];
    if (sortConfig.key && sortConfig.direction) {
      sortedData = sortData(
        sortedData,
        sortConfig.sortKey,
        sortConfig.direction
      );
    }
    return sortedData;
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            {headings.map((heading: any) => (
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
                  whiteSpace: "nowrap",
                }}
              >
                {heading.label}
                {heading.sort ? (
                  <TableSortLabel
                    active={true}
                    direction={
                      sortConfig.key === heading.label
                        ? sortConfig.direction
                        : "desc"
                    }
                    onClick={() => handleSort(heading.label, heading.sortKey)}
                  />
                ) : heading.icon ? (
                  <FilterList
                    sx={{
                      verticalAlign: "middle",
                      marginLeft: "0.5rem",
                      cursor: "pointer",
                      color: palette.neutral500,
                    }}
                    className={isRotate ? "rotate180" : ""}
                    onClick={() => {
                      setIsRotate(!isRotate);
                      handleSort(heading.label, heading.sortKey);
                    }}
                  />
                ) : (
                  ""
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={headings.length}>
                <Typography
                  variant="h4"
                  sx={{ textAlign: "center", color: palette.neutral500 }}
                >
                  No Data Found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            getSortedData().map((item, index) => (
              <TableRow key={index}>
                {headings.map((heading: any) => (
                  <TableCell
                    key={heading.label}
                    sx={{
                      fontFamily: "Inter",
                      fontSize: "14px",
                      fontWeight: 400,
                      fontStyle: "normal",
                      lineHeight: "20px",
                      maxWidth: "12.5rem",
                      wordWrap: "break-word",
                    }}
                  >
                    {heading.label === "S.No" ? index + 1 : null}
                    {heading.name === "spocName" ? (
                      <span>
                        {item.spocFirstName} {item.spocLastName}
                      </span>
                    ) : heading.name === "categories" ? (
                      <Stack direction={"row"} spacing={1}>
                        {Array.isArray(item[heading.name]) ? (
                          <>
                            {getDisplayedCategories(item[heading.name])?.map(
                              (category: string, index: number) => (
                                <Chip
                                  key={index}
                                  label={category}
                                  sx={{
                                    backgroundColor: palette.primary,
                                    color: palette.white,
                                    fontFamily: "Inter",
                                    fontSize: "14px",
                                  }}
                                />
                              )
                            )}
                            {item[heading.name].length > 2 ? (
                              <Chip
                                label={`+${item[heading.name].length - 2}`}
                                sx={{
                                  backgroundColor: palette.grey,
                                  color: palette.white,
                                }}
                                // onClick={toggleShownCategories}
                              />
                            ) : null}
                          </>
                        ) : (
                          <Chip
                            label={item[heading.name]}
                            sx={{
                              backgroundColor: palette.primary,
                              color: palette.white,
                            }}
                          />
                        )}
                      </Stack>
                    ) : heading.name === "influencersAssigned" ? (
                      item[heading.name]?.slice(0, 3).length === 0 ? (
                        <span style={{ textAlign: "center", display: "block" }}>
                          N/A
                        </span>
                      ) : (
                        <AvatarGroup sx={{ justifyContent: "center" }}>
                          {item[heading.name]
                            ?.slice(0, 3)
                            .map((user: any, index: number) =>
                              user?.influencer?.profileUrl ||
                              user?.profileUrl ? (
                                // If profilePic exists, show the Avatar
                                <Avatar
                                  key={index}
                                  alt={
                                    user?.influencer?.firstName ||
                                    user?.firstName
                                  }
                                  src={
                                    user?.influencer?.profileUrl ||
                                    user?.profileUrl
                                  }
                                />
                              ) : (
                                <Avatar
                                  key={index}
                                  sx={{
                                    bgcolor: palette.shades.orange.shade4,
                                    color: palette.shades.blue.shade4,
                                  }}
                                >
                                  {user &&
                                    (
                                      user?.influencer?.firstName ||
                                      user?.firstName
                                    )?.charAt(0)}
                                  {user &&
                                    (
                                      user?.influencer?.lastName ||
                                      user?.lastName
                                    )?.charAt(0)}
                                </Avatar>
                              )
                            )}
                          {item[heading.name]?.length > 3 ? (
                            <Avatar key="more" sx={{ bgcolor: palette.grey }}>
                              +{item[heading.name]?.length - 3}
                            </Avatar>
                          ) : null}
                        </AvatarGroup>
                      )
                    ) : heading.name === "status" ? (
                      <Select
                        value={item.status}
                        onChange={(e) =>
                          handleStatusChange(item.id, e.target.value)
                        }
                        size="small"
                        sx={{
                          backgroundColor:
                            item.status === "Active"
                              ? palette.successLight
                              : item.status === "Closed"
                              ? palette.errorLight
                              : null,
                          color:
                            item.status === "Active"
                              ? palette.success
                              : palette.error,
                          borderRadius: "0.2rem",
                        }}
                      >
                        <MenuItem
                          value="Active"
                          style={{ color: palette.success }}
                        >
                          Active
                        </MenuItem>
                        <MenuItem
                          value="Closed"
                          style={{ color: palette.error }}
                        >
                          Closed
                        </MenuItem>
                      </Select>
                    ) : heading.name === "action" ? (
                      <Edit
                        sx={{
                          color: palette.primary,
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          onEdit(item);
                        }}
                      />
                    ) : heading.name === "sow" ? (
                      <span
                        style={{ color: palette.links, cursor: "pointer" }}
                        onClick={() => handleSowClick(item[heading.name])}
                      >
                        SOW
                      </span>
                    ) : heading.name === "brand" ? (
                      <span>{item?.brand?.brandName}</span>
                    ) : (
                      item[heading.name]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <SowDetailsModal
        sowData={selectedSow}
        isOpen={isSowModalOpen}
        onClose={() => setSowModalOpen(false)}
      />
    </>
  );
};

export default GenericTable;
