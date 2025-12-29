import React from "react";
import { Paper, Typography, Box, Stack } from "@mui/material";
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from "@mui/lab";
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';

const ActivityTimeline = ({ events = [] }) => {
  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>System Events</Typography>
      
      {events.length === 0 ? (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 4, opacity: 0.5 }}>
          <HistoryToggleOffIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="body2">No recent activity detected</Typography>
        </Stack>
      ) : (
        <Timeline position="right" sx={{ p: 0 }}>
          {events.map((event, index) => (
            <TimelineItem key={index}>
              <TimelineOppositeContent color="textSecondary" sx={{ flex: 0.2, fontSize: "0.8rem" }}>
                {event.time}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color={event.color} variant="outlined" />
                {index !== events.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent sx={{ py: "12px", px: 2 }}>
                <Typography variant="body2">{event.msg}</Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      )}
    </Paper>
  );
};

export default ActivityTimeline;
