import * as React from 'react';
import { Card, CardActions, CardContent, Button, Typography, Collapse, IconButton, IconButtonProps, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';

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

export default function ReferralCard(props: { self: boolean }) {
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };
  return (
    <Card >
      <CardContent>
        <Box sx={{justifyContent: 'space-between', display: 'flex',}}>
          <Typography gutterBottom variant="h5" component="span">
              Software Engineer at Company A
          </Typography>
          <IconButton aria-label="delete" color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">
            Name: John Doe
        </Typography>
        <Typography variant="body2" color="text.secondary">
            Email: test@companya.com
        </Typography>
        <Typography variant="body2" color="text.secondary">
            Current Location: Gainesville, Florida
        </Typography>
        <Typography variant="body2" color="text.secondary">
            Years of Experience: 1-3 Years
        </Typography>
        <Typography variant="body2" color="text.secondary">
            School: University of Florida
        </Typography>
        <Typography variant="body2" color="text.secondary">
            JobId: 123456
        </Typography>
        {props.self && <Typography variant="body2" color="text.secondary">
            Message from You: Gib job ples.
        </Typography> }
      </CardContent>
      <CardActions disableSpacing>
        {!props.self && <Button size="large" color="success">Reveal Candidate</Button>}
        <Button size="large" endIcon={<DownloadIcon />}>
            Resume
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
            Gib job ples.
          </Typography>
        </CardContent>
      </Collapse>}
    </Card>
  );
}