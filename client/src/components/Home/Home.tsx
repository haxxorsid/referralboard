import {theme} from '../../common/theme';
import { ThemeProvider } from '@mui/material/styles';
import ReferralCard from './Card';
import { CssBaseline, Typography, GlobalStyles, Container, Tabs, Tab} from '@mui/material';
import NavBar from '../NavBar';
import Toast from '../common/Toast';
import React, { useEffect } from 'react';
import { getPostsByUserId, getPostsByCompanyId, deletePostById } from '../../common/apiService';
import { postType } from '../../types';

export default function Home() {
  const [value, setValue] = React.useState(0);
  const [showToast, setShowToast] = React.useState(false);
  const [toastSeverity, setToastSeverity] = React.useState("success");
  const [toastMessage, setToastMessage] = React.useState("");
  const [posts, setPosts] = React.useState<postType[]>([]);

  const fetchPosts = (value: number) => {
    if (value == 0) {
      getPostsByUserId().then((res) => {
        setPosts(res);
      }).catch((error)=>{
        displayToast("error", error.message);
      });
    } else if (value == 1) {
      getPostsByCompanyId().then((res) => {
        setPosts(res);
      }).catch((error)=>{
        displayToast("error", error.message);
      });
    }
  }

  const deletePost = (postId: number) => {
    deletePostById(postId).then(() => {
        displayToast("success", "Deleted post");
        fetchPosts(value);
      }).catch((error: { message: string; })=>{
        displayToast("error", error.message);
      });
  }

  useEffect(() => {
    fetchPosts(value);
  }, [value]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const displayToast = (severity: string, message: string) => {
    setShowToast(true);
    setToastSeverity(severity);
    setToastMessage(message);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
      < NavBar />
      {/* Hero unit */}
      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography variant="h5" align="center" color="text.secondary" component="p">
          Posts
        </Typography>
      </Container>
      <Container maxWidth="md" sx={{ alignItems: 'center' }}>
        <Tabs value={value} onChange={handleTabChange} aria-label="disabled tabs example" centered>
            <Tab label="By you" />
            <Tab label="By others for your company" />
        </Tabs>
      </Container>
      <Container
        maxWidth="sm"
        component="footer"
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          mt: 1,
          py: [3, 6],
          alignItems: 'center', 
        }}
      >
        {posts.map((post, index) => < ReferralCard key={index} self={value==0? true:false} displayToast={displayToast} post={post} deletePost={deletePost}/>)}
        {posts.length==0 && <Typography variant="h6" align="center" color="text.secondary" component="p">
          {'No posts to show you.'}
        </Typography>}
        <Toast
          open={showToast}
          severity={toastSeverity}
          message={toastMessage}
          setOpen={setShowToast}
        />
      </Container>
      </ThemeProvider>
  );
}