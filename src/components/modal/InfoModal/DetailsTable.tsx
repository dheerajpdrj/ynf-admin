import React from "react";
import {
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { palette } from "../../../constants/colors";

const DetailsTable = (props: any) => {
  const { data } = props;
  const customCellStyle = {
    color: "var(--Primary, #F60)",
    fontFamily: "Inter",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 600,
    lineHeight: "18px" /* 128.571% */,
  };

  const detailsCustomStyle = {
    color: "var(--Text-grey, #667085)",
    fontFamily: "Inter",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 600,
    lineHeight: "20px",
  };
  return (
    <div>
      <Table>
        <TableBody>
          {data.map((item: any) => (
            <TableRow key={item.label}>
              <TableCell sx={{ ...customCellStyle, whiteSpace: "nowrap" }}>
                {item.label}
              </TableCell>
              <TableCell
                sx={{
                  ...detailsCustomStyle,
                  maxWidth:
                    item.label === "Description" || item.label === "Categories"
                      ? "18rem"
                      : "none",
                  wordBreak: "break-word",
                }}
              >
                {item.label === "Category" ? (
                  <Stack direction="row" spacing={1}>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        maxHeight: "100%",
                        maxWidth: "100%",
                        gap: "0.5rem",
                        overflowY: "auto",
                      }}
                    >
                      {item.value?.map((category: string, index: number) => (
                        <Chip
                          key={index}
                          label={category}
                          sx={{
                            backgroundColor: palette.primary,
                            color: palette.white,
                          }}
                        />
                      ))}
                    </div>
                  </Stack>
                ) : item.value ? (
                  item.value
                ) : (
                  "N/A"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DetailsTable;
