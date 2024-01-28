import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Typography,
} from "@mui/material";
import { palette } from "../../constants/colors";
import { Delete } from "@mui/icons-material";

const CSVDataTable = (props: any) => {
  const { tableData, onDelete, heading } = props;

  return (
    <Table>
      <TableHead sx={{ backgroundColor: palette.neutral50 }}>
        <TableRow>
          <TableCell>S.No</TableCell>
          {heading.map((header: any, index: any) => (
            <TableCell key={index}>{header}</TableCell>
          ))}
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tableData?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={heading.length + 2}>
              <Typography
                variant="h4"
                sx={{ textAlign: "center", color: palette.neutral500 }}
              >
                No Data Found
              </Typography>
            </TableCell>
          </TableRow>
        ) : (
          tableData?.map((row: any, rowIndex: any) => (
            <TableRow key={rowIndex}>
              <TableCell>{rowIndex + 1}</TableCell>
              {row.map((cell: any, cellIndex: any) => (
                <TableCell key={cellIndex}>{cell}</TableCell>
              ))}
              <TableCell>
                <IconButton onClick={() => onDelete(rowIndex)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default CSVDataTable;
