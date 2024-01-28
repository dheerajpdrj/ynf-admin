import { palette } from "../constants/colors";

export function getColorForText(type: string) {
  switch (type) {
    case "Completed":
      return palette.links; // Text color for "Completed"
    case "In Progress":
      return palette.secondary; // Text color for "In Progress"
    case "To Do":
      return palette.success; // Text color for "To Do"
    case "Due":
      return palette.links; // Text color for "Due"
    case "Paid":
      return palette.success; // Text color for "Paid"
    case "Dispute":
      return palette.error; // Text color for "Dispute"
    default:
      return "inherit"; // Default text color
  }
}

export function getColorForBackground(type: string) {
  switch (type) {
    case "Completed":
      return palette.shades.blue.shade5; // Background color for "Completed"
    case "In Progress":
      return palette.shades.yellow.shade4; // Background color for "In Progress"
    case "To Do":
      return palette.shades.green.shade3; // Background color for "To Do"
    case "Due":
      return palette.shades.blue.shade5; // Background color for "Due"
    case "Paid":
      return palette.shades.green.shade3; // Background color for "Paid"
    case "Dispute":
      return palette.shades.orange.shade6; // Background color for "Dispute"
    default:
      return "transparent"; // Default background color
  }
}
