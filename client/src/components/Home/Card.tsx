import * as React from 'react';
import { Card, CardActions, CardContent, Button, Typography, Collapse, IconButton, IconButtonProps, Box, Tooltip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import LinkIcon from '@mui/icons-material/Link';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link as RouterLink } from 'react-router-dom';
import { cardProps } from '../../types';
import VerifiedIcon from '@mui/icons-material/Verified';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function ReferralCard(props: cardProps) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ mt: 1, width: '100%' }} >
      <CardContent>
        <Box sx={{ justifyContent: 'space-between', display: 'flex', }}>
          {props.self && <Tooltip title="Target position and company" placement="top-end">
            <Typography gutterBottom variant="h5" component="span">
            {props.post.targetPosition} at {props.post.company.name}
          </Typography></Tooltip>}
          {!props.self && <Typography gutterBottom variant="h5" component="span">
            <Tooltip title="Current position and company" placement="top-end">
              <span>{props.post.user.currentPosition} at {props.post.user.currentCompanyName}</span>
              </Tooltip>
            {props.post.user.verified && <Tooltip title="This user is verified" placement="top-end">
              <IconButton>
                <VerifiedIcon color="success" />
              </IconButton>
            </Tooltip>}
          </Typography>}
          {props.self && <Button endIcon={<DeleteIcon />} size="large" onClick={() => { props.deletePost(props.post.postId) }}>
          </Button>}
        </Box>
        {!props.self && <Typography variant="body2" color="text.secondary">
          Name: {props.post.user.firstName} {props.post.user.lastName}
        </Typography>}
        {!props.self && <Typography variant="body2" color="text.secondary">
          Email: {props.post.user.email}
        </Typography>}
        {!props.self && <Typography variant="body2" color="text.secondary">
          Current Location: {props.post.user.currentLocation}
        </Typography>}
        {!props.self && <Typography variant="body2" color="text.secondary">
          Target Position: {props.post.targetPosition}
        </Typography>}
        {!props.self && <Typography variant="body2" color="text.secondary">
          Years of Experience: {props.post.user.yearsOfExperience.description}
        </Typography>}
        {!props.self && <Typography variant="body2" color="text.secondary">
          School: {props.post.user.school}
        </Typography>}
        {props.self && <Typography variant="body2" color="text.secondary">
          Message from You: {props.post.message}
        </Typography>}
        <Typography variant="body2" color="text.secondary">
          Posted at: {new Date(props.post.createdAt).toISOString()}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button endIcon={<LinkIcon />} size="large" onClick={() => { window.open(props.post.resume, '_blank'); }}>
          Resume
        </Button>
        <Button endIcon={<LinkIcon />} size="large" onClick={() => { window.open(props.post.jobLink, '_blank'); }}>
          Job link
        </Button>
        {!props.self && <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>}
      </CardActions>
      {!props.self && <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Message from Candidate:</Typography>
          <Typography variant="body2" color="text.secondary">
            {props.post.message}
          </Typography>
        </CardContent>
      </Collapse>}
    </Card>
  );
}