import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import type { JSX } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export function Collapsable(props: {
  label: string;
  children: JSX.Element | JSX.Element[];
}) {
  return (
    <div>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography component="span">{props.label}</Typography>
        </AccordionSummary>
        <AccordionDetails>{props.children}</AccordionDetails>
      </Accordion>
    </div>
  );
}
